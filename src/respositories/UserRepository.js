const User = require("../entities/User");
const { hash, compare } = require("bcryptjs");
const { AvatarGenerator } = require("random-avatar-generator");
const { format, addDays } = require("date-fns");

class UserRepository {
  async create({
    nome,
    email,
    data_nascimento,
    telefone,
    genero,
    senha,
    avatar,
  }) {
    const passwordHash = await hash(senha, 8);
    const generator = new AvatarGenerator();

    const saveAvatar = avatar
      ? `${process.env.DOMAIN_APP}/user/${avatar.filename}`
      : generator.generateRandomAvatar("avatar");

    const userExists = await User.findOne({ email });

    if (userExists) {
      return { message: "E-mail já cadastrado" };
    }

    const user = await User.create({
      nome,
      email,
      data_nascimento: new Date(data_nascimento),
      telefone,
      genero,
      avatar: saveAvatar,
      senha: passwordHash,
    });
    return user;
  }

  async login(email, senha) {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      console.log("userExists", userExists);
      return;
    }

    const passwordCompare = await compare(senha, userExists.senha);

    if (!passwordCompare) {
      console.log("passwordCompare", passwordCompare);
      return;
    }

    return userExists;
  }

  async findUserById(id) {
    const user = await User.findById(id);
    return {
      _id: user,
      nome: user.nome,
      email: user.email,
      avatar: user.avatar,
      data_nascimento: format(addDays(user.data_nascimento, 1), "yyyy-MM-dd"),
      telefone: user.telefone.replace(" ", "-"),
      genero: user.genero,
      senha: user.senha,
    };
  }

  async updateUserById(
    id,
    { nome, email, data_nascimento, telefone, genero, avatar }
  ) {
    if (avatar) {
      const saveAvatar = `${
        process.env.DOMAIN_APP
      }/user/${avatar.filename.replace(" ", "-")}`;
      const userUpdate = await User.findByIdAndUpdate(id, {
        nome,
        email,
        data_nascimento,
        telefone,
        genero,
        avatar: saveAvatar,
      });
      return userUpdate;
    } else {
      const userUpdate = await User.findByIdAndUpdate(id, {
        nome,
        email,
        data_nascimento,
        telefone,
        genero,
      });
      return userUpdate;
    }
  }

  async updatePassword(id, senha_atual, nova_senha) {
    const userExists = await User.findById(id);
    if (!userExists) {
      console.log("userExists", userExists);
      return;
    }
    const passwordHash = await compare(senha_atual, userExists.senha);
    if (!passwordHash) {
      console.log("passwordHash update", passwordHash);
      return;
    }

    const newPasswordHash = await hash(nova_senha, 8);
    const user = await User.findByIdAndUpdate(id, { senha: newPasswordHash });
    return user;
  }
}

module.exports = UserRepository;
