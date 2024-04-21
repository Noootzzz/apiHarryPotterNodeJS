const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/bcrypt");

class UsersController {
  async getMyProfile(req, res) {
    const user = req.user;
    return res.status(200).send(user);
  }

  async index(req, res) {
    try {
      const user = await prisma.user.findMany(); //recuperer la liste de tous les users et attendre la reponse
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async store(req, res) {
    try {
      const body = req.body;
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: await hashPassword(body.password),
        },
      });
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async show(req, res) {
    try {
      const id = req.params.idUser;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.idUser;
      const body = req.body;
      let user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: body,
      });

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const id = req.params.idUser;
      let user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      user = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return res.status(204).send("User deleted");
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new UsersController();
