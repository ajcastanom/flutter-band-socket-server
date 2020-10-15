const Bands = require("../models/bands");
const Band = require("../models/band");
const { io } = require('../index');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metallica'));
console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('message', (payload) => {
        console.log('Mensaje!!', payload);

        io.emit('message', {
            admin: 'Nuevo mensaje'
        });
    });

    client.on('emitir-mensaje', (payload) => {
        //io.emit('nuevo-mensaje', payload);
        client.broadcast.emit('nuevo-mensaje', payload)
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('new-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });


});
