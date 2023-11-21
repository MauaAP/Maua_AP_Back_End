/* Criação e utilização do banco de dados da Academia dos Professores. */
create database if not exists db_academia_dos_professores;
use db_academia_dos_professores;

/* Criação das tabelas do BD. */

/* Criação da tabela de usuário. */
/* Esta tabela é para a identificação dos participantes dos eventos, sejam eles da instituição ou não. O login na plataforma será 
realizado pelo e-mail e senha de cada usuário. */
create table tb_usuario (
`pk_cpfUsuario` int not null primary key,
`nomeUsuario` varchar(256) not null,
`isProf` boolean not null,
`matricula` int not null,
`telefone` int not null,
`email` varchar(256) not null unique,
`senha` varchar(24) not null
);

/* Criação da tabela de sala */
/* Esta tabela é para a identificação de cada sala da instituição em que podem ser realizados estes eventos. */
create table tb_sala (
`pk_idSala` int not null auto_increment primary key,
`salaNumero` varchar(4) unique,
`salaNome` varchar(100) unique,
`capacidade` int not null
);

/* Criação da tabela de modalidade */
/* Esta tabela é para a identificação de todas as modalidades possíveis para realização dos eventos. */
create table tb_modalidade (
`pk_idModalidade` int not null auto_increment primary key,
`modalidade` varchar(10) not null unique
);

/* Criação da tabela de tipo */
/* Esta tabela é para a identificação de todas os tipos possíveis para realização dos eventos. */
create table tb_tipo (
`pk_idTipo` int not null auto_increment primary key,
`tipo` varchar(20) not null unique
);

/* Criação da tabela de evento */
/* Esta tabela é para a identificação de itens relacionados aos eventos que dificilmente serão alterados. */
create table tb_evento (
`pk_idEvento` int not null auto_increment primary key,
`nomeEvento` varchar(100) not null unique,
`publicoAlvo` varchar(50) not null,
`competencias` varchar(100),
`conteudo` varchar(100)
);

/* Criação da tabela de detalhe */
/* Esta tabela é para a identificação de detalhes relacionados aos eventos que serão alterados com frequência. */
create table tb_detalhe (
`pk_idDetalhe` int not null auto_increment primary key,
`idTipo` int not null,
`idEvento` int not null,
`cpfResponsavel` int not null,
`idModalidade` int not null,
`maxParticipantes` int not null,
`objetivoEvento` varchar(100),
foreign key (idTipo) references tb_tipo(pk_idTipo) on delete cascade on update cascade,
foreign key (idEvento) references tb_evento(pk_idEvento) on delete cascade on update cascade,
foreign key (cpfResponsavel) references tb_usuario(pk_cpfUsuario) on delete cascade on update cascade,
foreign key (idModalidade) references tb_modalidade(pk_idModalidade) on delete cascade on update cascade
);

/* Criação da tabela de ocorrência */
/* Esta tabela é para a identificação de data e hora de início e término de cada evento, relacionada diretamente com seus detalhes,
bem como o local e carga horária da atividade. */
create table tb_ocorrencia (
`pk_idOcorrencia` int not null auto_increment primary key,
`idSala` int not null,
`idDetalhe` int not null,
`inicioEvento` datetime not null,
`terminoEvento` datetime not null,
`cargaHoraria` int,
foreign key (idSala) references tb_sala(pk_idSala) on delete cascade on update cascade,
foreign key (idDetalhe) references tb_detalhe(pk_idDetalhe) on delete cascade on update cascade
);

/* Criação da tabela de aplicador */
/* Esta tabela é para a identificação dos aplicadores de cada evento relacionada aos detalhes do mesmo. */
create table tb_aplicador (
`pk_idAplicador` int not null auto_increment primary key,
`cpfAplicador` int not null,
`idDetalhe` int not null,
foreign key (cpfAplicador) references tb_usuario(pk_cpfUsuario) on delete cascade on update cascade,
foreign key (idDetalhe) references tb_detalhe(pk_idDetalhe) on delete cascade on update cascade
);

/* Inserção de valores no BD. */

/* Exemplo de inserção de valores na tabela de sala, dados não necessariamente corretos. */
insert into tb_sala (salaNumero, salaNome, capacidade) values ('h201', 'auditorio', 100);
insert into tb_sala (salaNome, capacidade) values ('auditorio beta', 50);

/* Inserção de valores já definidos. NÃO ALTERAR. */

/* Inserção de valores na tabela de modalidade. */
insert into tb_modalidade (modalidade) values ('presencial');
insert into tb_modalidade (modalidade) values ('online');
insert into tb_modalidade (modalidade) values ('hibrido');

/* Inserção de valores na tabela de tipo. */
insert into tb_tipo (tipo) values ('workshop');
insert into tb_tipo (tipo) values ('palestra');
insert into tb_tipo (tipo) values ('seminário da ap');
insert into tb_tipo (tipo) values ('visita');
insert into tb_tipo (tipo) values ('curso');
insert into tb_tipo (tipo) values ('outros');