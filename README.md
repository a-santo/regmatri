# RegMatri

🇵🇹
Este projeto foi desenvolvido como trabalho final da unidade curricular Programação Web Avançada 2020, parte do [Mestrado em Tecnologias e Sistemas Informáticos Web](http://www2.uab.pt/guiainformativo/detailcursos.php?curso=63) da Universidade Aberta.

🇬🇧
This project was developed as the final assignment of the class Advanced Web Programming, class of 2020, part of the [Master’s Degree in Web Technologies and Systems](http://www2.uab.pt/guiainformativo/eng_detailcursos.php?curso=63) of Open University (Portugal).

### Descrição/Description

🇵🇹
__RegMatri__ é uma plataforma simples de registo de matrículas automóveis de Portugal, com as seguintes funcionalidades:
- Registo manual de ocorrência de matrículas (matrícula, rua, cidade, região, data, hora e imagem)
- Registo automático com o reconhecimento de matrículas feito de forma automática a partir de imagens (JPEG ou PNG). 
- Pesquisa de matrículas inseridas na base de dados, bem como a imagem da ocorrência.
- Autenticação (o registo de matrículas apenas é permitido a utilizadores autenticados)

Por fazer:
- Uma interface mobile-friendly
- No futuro, pretende-se adicionar a capacidade de processar também vídeos e extrair a imagem do frame específico da captura.
- ... entre a melhoria de diversas funcionalidades e resolução de potenciais bugs

🇬🇧
__RegMatri__ is a simple plaform to register Portuguese car plate numbers that has the following functionalities available:
- Manual registration of plate sightings (plate number, street name, city, region, date, time and image)
- Automatic registration with automatic image recognition to extract the number directly from the provided image (JPEG and PNG supported)
- Search engine for plates that were added to the system, with all the info that was part of the registration, including the image
- Authentication (plate registration can only be carried out by logged in users)

To-do:
- A mobile friendly interface
- Support for video processing to extract plates as well as the image of the exact frame the plate was extracted from
- ... also several improvements and bug fixes, as well as solving potential bugs

### Tecnologias utilizadas/Technologies used
- Node.js
- Express
- Bootstrap
- jQuery
- Font Awesome
- Datetime picker (jQuery plugin)
- Sweetalert 2
- OpenALPR
- ... e diversos módulos Node.js/and several other Node.js modules!

### Requisitos/Requirements
- Node.js (v14.XX)
- NPM (6.XX)
- MariaDB 10.4 (`db/esquemaDB.sql` para criar a base de dados/to create the database)
- OpenALPR (https://github.com/openalpr/openalpr#binaries)**
- nodemon (opcional/optional)

** 🇵🇹 O binário *alpr* terá de estar instalado e fazer parte da variável de sistema PATH para utilizar a funcionalidade de reconhecimento automático de matrículas

** 🇬🇧 The *alpr* binary must be installed and be part of the system PATH to make use of the automated plate recognition functionality

### Instalação e execução / Instalation and start up
🇵🇹
1. Após satisfeitos os requisitos supracitados...
2. Clone este repositório: `git clone https://github.com/a-santo/regmatri.git`
3. No ficheiro `lib/dbcfg.js` adicione ou ajuste os parâmetros de ligação ao sistema de base de dados, consoante necessário: variáveis `host`, `user`, `password` e `schema`
4. Na pasta principal do projeto, crie um ficheiro `.env` com o seguinte conteúdo: `SECRET='teste'` ('teste' pode e deve ser alterado para um segredo melhor)
5. `cd regmatri`
6. `npm install`
7. `node server.js` ou `nodemon server.js`
8. Abra o browser e vá até: [http://localhost:8080/](http://localhost:8080/)

🇬🇧 
1. After satisfying the aforementioned requirements...
2. Clone this repository: `git clone https://github.com/a-santo/regmatri.git`
3. On the file `lib/dbcfg.js` add or modify the parameters to connect to the database, as needed: variables `host`, `user`, `password` and `schema`
4. On the project's main folder, create a file called `.env` with the following content: `SECRET='teste'` ('teste' can and should be altered to something proper)
5. `cd regmatri`
6. `npm install`
7. `node server.js` ou `nodemon server.js`
8. Open the browser and go to: [http://localhost:8080/](http://localhost:8080/)

### Demo

🇵🇹 Uma demo funcional está disponível no seguinte endereço: https://regmatri.asanto.dev/

🇬🇧 A functional demo is available on the following address: https://regmatri.asanto.dev/

Autenticação/Authentication: admin/progweb2020 

### Protótipo/Prototype
[Protótipo das funcionalidades gerais/General flow prototype](https://www.figma.com/proto/V9c4yhkJmE6m1LiKbyQqie/Projecto-Final?node-id=0%3A1&scaling=contain) 

[Protótipo do erro de início de sessão/Login error prototype](https://www.figma.com/proto/V9c4yhkJmE6m1LiKbyQqie/Projecto-Final?node-id=39%3A4&scaling=contain)

[Protótipo do erro de OpenALPR não detetado/OpenALPR not found error prototype](https://www.figma.com/proto/V9c4yhkJmE6m1LiKbyQqie/Projecto-Final?node-id=40%3A3&scaling=contain)

[Protótipo de erro de imagem inválida/Invalid image prototype](https://www.figma.com/proto/V9c4yhkJmE6m1LiKbyQqie/Projecto-Final?node-id=40%3A4&scaling=contain)

### Estrutura da BD/Database Structure

<div style="width:auto;text-align:center;padding:20px;">
    <img style="width:100%;height: 100%;object-fit: contain;" src="https://raw.githubusercontent.com/a-santo/regmatri/master/lib/exemplos/estrutura_bd.png">
</div>

### Créditos/Credits
**Author**: André Santo

**Project oriented by**: Professor Ricardo Baptista
