const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {
    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('estado-actual',ticketControl.ultimos4);
    socket.emit('ticket-pendientes',ticketControl.tickets.length)

    

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length);

        //Hay que notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('estado-actual',ticketControl.ultimos4);

    })

    socket.on('atender-ticket',({escritorio},callback)=>{
        if(!escritorio){
            return callback({
                ok: false,
                msg:'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        //Notificar cambio en los ultimos 4
        
        if(!ticket){
            callback({
                ok:false,
                msg:'Ya no hay tickets pendientes'
            })
        }else{
             socket.broadcast.emit('estado-actual',ticketControl.ultimos4);
             socket.broadcast.emit('ticket-pendientes',ticketControl.tickets.length);
             socket.broadcast.emit('notificacion',null);
            callback({
                ok:true,
                'ticket': ticket,
                'pendientes': ticketControl.tickets.length
            })
           
        }
    })

}



module.exports = {
    socketController
}

