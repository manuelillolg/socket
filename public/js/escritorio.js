//Referencias
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});


socket.on('ultimo-ticket',(ticket)=>{
    //lblNuevoTicket.innerText = "Ticket" +ticket;
})

socket.on('ticket-pendientes',(pendientes)=>{
    lblPendientes.innerText = pendientes;
    if(pendientes!==0){
        divAlerta.style.display='none';
    }
});

btnAtender.addEventListener( 'click', () => { 

    socket.emit('atender-ticket',({escritorio}),({ok,ticket,msg,pendientes}) =>{
        if(!ok){
            lblTicket.innerText= "nadie";
            return divAlerta.style.display='';
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`;
        lblPendientes.innerHTML = pendientes;

    })

    
    
  
});