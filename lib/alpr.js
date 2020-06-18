const shell = require('shelljs');
const exec = require('child_process');

// função para verificar se alpr está instalado no sistema
async function verificarAlpr() {
    return !!shell.which('alpr');
}

// função para executar alpr e devolver os resultados
async function executarAlpr(imagem) {
    const resultado = exec.execSync('alpr -j -c eu -p pt ' + imagem).toString()
    return resultado
}

module.exports = {
    verificarAlpr: verificarAlpr,
    executarAlpr: executarAlpr
}