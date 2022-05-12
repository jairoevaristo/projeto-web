const User = require("../entities/User");
const { hash, compare } = require("bcryptjs");
const { AvatarGenerator } = require("random-avatar-generator");

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
}

module.exports = UserRepository;
