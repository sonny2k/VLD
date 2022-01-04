require('dotenv').config()
const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../../middleware/auth')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const Account = require('../../models/Account')
const User = require('../../models/User')

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async(req, res) => {
    const {fname, lname, phonenum, password, role} = req.body

    //simple validation
    if (!phonenum || !password || !fname || !lname || !role)
    return res
    .status(400)
    .json({success: false, message: 'Thiếu thông tin'})

    try {
        //check for existing account
        const account = await Account.findOne({ phonenum })

        if (account)
        return res
        .status(400)
        .json({success: false, message: 'Số điện thoại đã được đăng ký ở tài khoản khác'})

        //OK!
        const hashedPassword = await argon2.hash(password)
        let role = 'người dùng'
        const newAccount = new Account({fname, lname, phonenum, password: hashedPassword, role})
        await newAccount.save()
    
        // Return token
        const accessToken = jwt.sign(
            { accountId: newAccount._id }, 
            process.env.ACCESS_TOKEN_SECRET
        )   
    
        res.json({
            success: true, 
            message: 'Tạo tài khoản thành công', 
            accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Lỗi nội bộ'})
    }

})

router.post('/sendcode', async(req, res) => {
    const {phonenum} = req.body

    //simple validation
    if (!phonenum)
    return res
    .status(400)
    .json({success: false, message: 'Thiếu thông tin'})

    //check for existing account
    const account = await Account.findOne({ phonenum })

    if (account)
    return res
    .status(400)
    .json({success: false, message: 'Số điện thoại đã được đăng ký ở tài khoản khác'})

    //send code to phone number
    client.verify.services('VA85da000b869107ba0c8f11f348519989')
    .verifications
    .create({to: phonenum, channel: 'sms'})
    .then(verification => console.log(verification.status));
})

router.post('/verifycode', async(req, res) => {
    const {phonenum, code} = req.body

    //simple validation
    if (!phonenum || !code)
    return res
    .status(400)
    .json({success: false, message: 'Thiếu thông tin'})

    //check verify code
    await client.verify.services('VA85da000b869107ba0c8f11f348519989')
    .verificationChecks
    .create({to: phonenum, code: code})
    .then(verification_check => console.log(verification_check.status));
})

router.post('/createuser', verifyToken, async(req, res) => {
    const {account, bloodtype, height, weight, pastmedicalhistory, drughistory, familyhistory} = req.body

    //check for existing account
    const user = await User.findOne({ account })

    if (user)
    return res
    .status(400)
    .json({success: false, message: 'Người dùng này đã được tạo trước đó'})

    //create a new user based on the above account
    try {
        const newUser = new User({account, bloodtype, height, weight, pastmedicalhistory, drughistory, familyhistory})
        await newUser.save()

        res.json({
            success: true, 
            message: 'Tạo người dùng thành công', 
            accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Lỗi nội bộ'})
    }
})

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async(req, res) => {
    const {phonenum, password} = req.body

    //simple validation
    if (!phonenum || !password)
    return res
    .status(400)
    .json({success: false, message: 'Thiếu thông tin'})

    try {
        // Check for existing account
        const account = await Account.findOne({ phonenum })
        if (!account)
        return res.status(400).json({success: false, message: 'Sai số điện thoại'})

        // phonenum found
        const passwordValid = await argon2.verify(account.password, password)
        if (!passwordValid)
        return res.status(400).json({success: false, message: 'Sai mật khẩu'})

        //OK!
        //Return token
        const accessToken = jwt.sign(
            { accountId: account._id }, 
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({
            success: true, 
            message: 'Đăng nhập thành công', 
            accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Lỗi nội bộ'})
    }
})

// @route POST api/auth/resetpassword
// @desc Reset password of user
// @access Public
router.post('/resetpassword', async(req, res) => {
    const {phonenum, newpassword} = req.body

    //simple validation
    if (!phonenum || !newpassword)
    return res
    .status(400)
    .json({success: false, message: 'Thiếu thông tin'})

    try {
        // Check for existing account
        const account = await Account.findOne({ phonenum })
        if (!account)
        return res.status(400).json({success: false, message: 'Sai số điện thoại'})

        // phonenum found and pass verification
        const passwordvalid = await argon2.verify(account.password, newpassword)
        if (passwordvalid)
        return res.status(400).json({success: false, message: 'Mật khẩu mới giống với mật khẩu hiện tại'})
        const hashedNewPassword = await argon2.hash(newpassword)

        try {
            let updatedPassword = {
                password: hashedNewPassword
            }
            const profileupdatecondition = { _id: account._id }
            updatedPassword = await Account.findOneAndUpdate(profileupdatecondition, updatedPassword, {new: true})
    
            res.json({success: true, message: 'Mật khẩu mới đã được cập nhật', account: updatedPassword})
    
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Lỗi nội bộ'})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Lỗi nội bộ'})
    }
})
module.exports = router