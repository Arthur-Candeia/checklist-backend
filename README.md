# Checklist (Back-end)
Projeto Full-Stack SPA feito com React e com hospedagem ativa no MongoDB Atlas! Nele coloquei em prática diversos aprendizados, como schema, rotas, componentização, entre outros. O projeto possui 4 páginas principais: login, usuário, novo usuário e termos de uso. O usuário pode: criar novas tarefas, editá-las, excluí-las e marca-las como concluídas! Esta aplicação utiliza dois tipos de criptografia para garantir a segurança e privacidade do usuário!

<p align="center">
<img src="https://github.com/Arthur-Candeia/checklist-frontend/blob/master/public/imgToReadme.png" >
</p>

## O que está presente na aplicação?
 - _Organização 🗂️:_ O usuário pode organizar suas tarefas de forma prática!
 - _Velocidade ⚡:_ A velocidade dos bancos de dados não-relacionais é bem alta, dessa forma todas as atualizações são feitas com rapidez e eficácia!
 - _CRUD 👤:_ O usuário consegue realizar atividades fundamentais com a aplicação!

## Resumo dos arquivos
A aplicação possui dois tipos de criptografia: Uma criptografia hash para senhas (unidirecional) e uma criptografia de mão dupla para as tarefas (permite ser descriptografada), tudo isso para garantir maior segurança para os usuários! 

### SRC
#### app.js
Arquivo principal da aplicação, ele faz a importação dos outros arquivos!

#### routes.js
Nessa arquivo de rotas temos todas as ações que podem ser feitas na aplicação! <br />
Rota `GET /` Redireciona para o link frontend da aplicação <br />
Rota `POST /` Login de Usuário <br />
Rota `POST /login` Rota para salvar uma tarefa em um usuário <br />
Rota `POST /newuser` Criação de novo usuário <br />
Rota `PUT /login` Edita uma tarefa já existente <br />
Rota `PUT /login/done/:user/:index/:condition` Marca ou tira a marcação (check) de uma tarefa <br />
Rota `DELETE /login/:user/:index` Deleta uma tarefa com base em seu index <br />

#### crypto.js
Arquivo responsável por criptografar e descriptografar cada uma das tarefas (criptografia de mão dupla: bcrypt)!


### DB
#### db.js
Arquivo que faz a conexão com o mongoDB Atlas.

#### model.js
Arquivo onde está a estrutura do banco de dados (Schema) e o exportamos como um model!

## Porque criei essa aplicação?
Essa aplicação foi desenvolvida com o intuito de aprimorar minhas habilidades na manipulação de banco de dados e práticas no backend! Além fornecer ao usuário velocidade nas respostas de suas informações para melhor organização com a SPA!
📄 Visite o projeto clicando [Aqui](https://checklist-fullstack-arthur-candeia.vercel.app/)!