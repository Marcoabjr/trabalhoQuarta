 - para testar as requisições tera que fazer as instalaçoes das dependencias 

   npm init 
   npm install bcrypt dotenv express jsonwebtoken mongoose nodemon

 - Rotas Utilizadas no postman. 
   Foi feito configuração das rotas, cololcando elas em uma variavel no postaman 
   Rotas para teste
   {{URL}}/auth/register = Para registrar um usuário. 
   {{URL}}/auth/login = PAra testar o login do usuário.
   {{URL}}/user/66324440bd533b73aa13f2af = Retorna um usuário com token funcionando. Caso Usuário não estiver com token, não funciona. 
   

   falou somente a rota delete e update. 


testes feitos 

{
  "name": "marcoJr",
  "email": "marco@teste.com",
  "password": "123456",
}