const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const identity = require('aspnetcore-identity-password-hasher');
const { v4: uuidv4 , v1: uuidv1 } = require('uuid');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    //testsellerbama69
    console.log("email",email);
    console.log("password",password);

    const user = await db.User.findOne({ where: { NormalizedEmail: email }, attributes: ['Email','UserName', 'PasswordHash','LastName','Rating','PaypalEmail','PhoneNumber',['Id','UserIdd']],});
     console.log("user>>>>>>>",user);
    // if (!user || !(await bcrypt.compare(password, user.PasswordHash)))
    //     throw 'Username or password is incorrect';
    
   const identity_check = await identity.verify(password, user.PasswordHash).then(res => {
        // res is true if the plain text password matches with the hash
        // otherwise false.
       return res;
      });
      
      if (!user || identity_check === false)
         throw 'Username or password is incorrect';

         
    // authentication successful
    const token = jwt.sign({ email: user.Email}, secret, { expiresIn: '7d' });
    console.log("user>>",user);
    //const token = jwt.sign({ user_id: user.Id, username},secret,{expiresIn: "7d",});
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    
    return await db.User.findAll({attributes: ['Id','UserName','LastName','Rating','PaypalEmail','PhoneNumber']});
}

async function getById(id) {
    return await getUser(id);
}

async function create(res,params) {
    // validate
    console.log("Params first",params)

    if (await db.User.findOne({ where: { UserName: params.UserName } })) {
        throw 'Username "' + params.UserName + '" is already taken';
    }

    if (await db.User.findOne({ where: { Email: params.Email } })) {
        throw 'Email "' + params.Email + '" is already taken';
    }

    const domain = params.Email.split('@')[1];
    const updatedDomain = "@" + domain;
    
    universities = await db.University.findOne({ where: { EmailDomain: updatedDomain } });
        
    if(!universities) {
        res.status(200).json({ message: 'You are not associated with any university' });
    }

    await identity.hash(params.password).then(hashedPassword => {
        // Store the hashed password
        params.PasswordHash = hashedPassword;
    });

   
    params.NormalizedEmail=params.Email
    params.NormalizedUserName=params.UserName;
    params.PhoneNumber="+923323167487"
    // params.NormalizedEmail=""
    // params.NormalizedEmail=""
    // params.NormalizedEmail=""

    const randomId = uuidv4();
    const randomIdv1 = uuidv1();
    params.Id=randomId;
    params.ConcurrencyStamp=randomIdv1;

    console.log("Params second",params);

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    // const user = await db.User.findByPk(id);

    console.log("use11111",id);
    const user = await db.User.findOne({ where: { Id:id } });;
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}