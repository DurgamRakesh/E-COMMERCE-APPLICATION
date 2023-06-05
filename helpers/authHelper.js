import bcrypt from 'bcrypt';

export const hashpassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashpass = await bcrypt.hash(password,saltRounds);
        return hashpass
    } catch (error) {
        console.log(error);
    }
};

export const comparepassword = async (password,hashpass) => {
    return bcrypt.compare(password,hashpass);
}