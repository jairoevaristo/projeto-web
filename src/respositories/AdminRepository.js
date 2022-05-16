const Admin = require("../entities/Admin");
const { hash, compare } = require("bcryptjs");

class AdminRepository {
  async create({ nome, email, telefone, status, senha, login }) {
    const passwordHash = await hash(senha, 8);
    const adminExistsLogin = await Admin.findOne({ login });

    console.log("adminExistsLogin", adminExistsLogin);

    if (adminExistsLogin) {
      console.log("opa", adminExistsLogin);
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
    console.log({ login, senha });

    const adminExists = await Admin.findOne({ login });
    console.log({ adminExists });

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

  async updateAdminById(id, { nome, email, telefone, login, senha, status }) {
    if (senha) {
      const userUpdate = await Admin.findByIdAndUpdate(id, {
        nome,
        email,
        login,
        telefone,
        status,
        senha,
      });
      return userUpdate;
    } else {
      const userUpdate = await Admin.findByIdAndUpdate(id, {
        nome,
        email,
        login,
        telefone,
        status,
      });
      return userUpdate;
    }
  }

  async findAdminById(id) {
    const admin = await Admin.findById(id);
    return admin;
  }

  async findAll() {
    const admins = await Admin.find();
    return admins;
  }
}

module.exports = AdminRepository;
