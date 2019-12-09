// docker ps
// docker exec -it 581cd7de56a5  mongo -u admin -p admin --authenticationDatabase admin

// show dbs -> mostra dbs disponiveis
// use nome_database -> mudar contexto para database especificada
// show collections -> mostrar coleções (tabelas)
// db.heroes.insert({
//   name: 'Flash',
//   power: 'Speed',
//   birthDay: '1998-01-01'
// }) -> inserir na coleção heroes
// db.heroes.find() -> listar info de heroes
// db.heroes.find().pretty() -> listar info de heroes formatada

// for (let i = 0; i < 1000; i++) {
//   db.heroes.insert({
//     name: `Clone-${i}`,
//     power: "Speed",
//     birthDay: "1998-01-01"
//   });
// } -> utilizando js no mongo
// db.heroes.find().limit(10).sort({name: -1})
