const Admin = require("../entities/Admin");
const { hash, compare } = require("bcryptjs");
const { format, addDays } = require("date-fns");

class AdminRepository {
  async create({ nome, email, telefone, status, senha, login }) {
    const passwordHash = await hash(senha, 8);
    const adminExists = await Admin.findOne({ email });
    const adminExistsLogin = await Admin.findOne({ login });

    if (adminExists) {
      return { message: "E-mail já cadastrado" };
    }

    if (adminExistsLogin) {
      return { message: "Login já cadastrado" };
    }

    const admin = await Admin.create({
      nome,
      email,
      telefone,
      login,
      status,
      senha: passwordHash,
    });

    return admin;
  }

  async login(login, senha) {
    const adminExists = await Admin.findOne({ login });
    if (!adminExists) {
      console.log("adminExists", adminExists);
      return;
    }

    const passwordCompare = await compare(senha, adminExists.senha);

    if (!passwordCompare) {
      console.log("passwordCompare", passwordCompare);
      return;
    }

    return adminExists;
  }

  async findAll() {
    const admins = await Admin.find();
    return admins;
  }
}

module.exports = AdminRepository;
