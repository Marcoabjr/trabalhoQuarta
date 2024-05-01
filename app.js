require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();

const User = require('./models/User');
const equipamento = require('./models/equipamentos');


// config json response 
app.use(express.json());
app.listen(3000)

// rota publica 
app.get("/", (req, res) => {
    res.status(200).json({ message: "Funcionando" });
  });

//rota privada 
app.get('/user/:id', checarToken, async (req, res)=>{
    const id= req.params.id

   const user = await User.findById(id,'-password')
    if(!user){
        return res.status(404).json({message: "usuário não encontrado. "})
   }
    res.status(200).json({ user })
})

function checarToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({message: 'Acesso Negado'})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    }catch(error){
        res.status(400).json({message: "token inválido "})
    }
}

// rota registro usuario
app.post('/auth/register', async (req,res) => {
    const {name, email, password, confirpassword} = req.body

     //validação usuário
    if(!name) {
        return res.status(422).json({message: "Nome é Obrigatorio"})
    }

    if(!email) {
        return res.status(422).json({message: "Email é Obrigatorio"})
    }

    if(!password) {
        return res.status(422).json({message: "Senha é Obrigatorio"})
    }

    if(password !== confirpassword) {
        return res.status(422).json({message: "As senhas não estão iguais. "})
    }

    const userExiste = await User.findOne({ email:email })

    if(userExiste){
        return res.status(422).json({message: "Tentando se cadastrar de novo ?. Este email já esta cadastrado. "})
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash,
    }) 

    try{
        await user.save()
        res.status(201).json({message:"Criação de usuário feita com Sucesso. "})
        
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Erro inesperado no servidor. Tente novamente mais tarde"})
  }
});

// Excluir Usuário
app.delete('delete/user/:id', checarToken, async (req, res) => {
  const id= req.params.token;

  try {
      const deleteUser = await User.findByIdAndDelete(id);

      if (!deleteUser) {
          return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.status(200).json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir o usuário." });
  }
});

//app.put('/user/:id', (req, res) =>{
  //const {id} = req.params;
  //const {name, email} = req.body
//});

//rota de login 
app.post('/auth/login', async (req, res)=> {
    const {email, password} = req.body

    if(!email) {
        return res.status(422).json({message: "Email é Obrigatorio"})
    }

     if(!password) {
        return res.status(422).json({message: "Senha é Obrigatorio"})
    }

    const user = await User.findOne({ email:email })

    if(!user) {
        return res.status(422).json({ message: "usuário não encontrado"})
    }

    const checarSenha = await bcrypt.compare(password, user.password)

    if(!checarSenha) {
        return res.status(422).json({message: "Errou a Senha. Tente novamente !!!"})
    }

    try{
       const secret = process.env.SECRET;
       const token = jwt.sign(
        {
           id:user._id,
       },
       secret,
    )
    res.status(200).json({messagem: "Autenticação Realizada com sucesso..", token});
        
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Erro inesperado no servidor. Tente novamente mais tarde"})
    }
    
});

// Registro de equipamentos 
app.post('/auth/equip', async (req,res) => {
  const {numero , name, tipo, preco} = req.body

  if(!numero) {
    return res.status(422).json({message: "Numeração equipamento é Obrigatorio"})
}

  if(!name) {
      return res.status(422).json({message: "Nome é Obrigatorio"})
  }

  if(!tipo) {
      return res.status(422).json({message: "tipo é Obrigatorio"})
  }

  if(!preco) {
      return res.status(422).json({message: "preço é Obrigatorio"})
  }

  const numeroExiste = equipamento.findOne({ numero:numero })

  if(numeroExiste){
      return res.status(422).json({message: "Tentando se cadastrar o mesmo numero de novo ?. Este numero já esta cadastrado. "})
  }

  const equipamento = new equipamento({
      numero,
      name,
      tipo,
      preco,
  }) 

  try{
      await equipamento.save()
      res.status(201).json({message:"equipamento cadastrado com sucesso. "})
      
  }catch(error){
      console.log(error)
      res.status(500).json({message: "Erro inesperado no servidor. Tente novamente mais tarde"})
}
});

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.zaiyie9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() =>{
    console.log("Conectado ao Banco")
});
