const mongoose = require('mongoose');

const equipamento = mongoose.model('equip',{
    numero: String,
    nome: String,
    preco: String,
    tipo: String,
});

module.exports = equipamento;