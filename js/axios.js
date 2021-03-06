let pagina = 1;
let peliculas = '';
let ultimaPelicula;

/*const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
    if (pagina < 1000) {
        pagina += 1;
        cargarPeliculas();
    }
});

btnAnterior.addEventListener('click', () => {
    if (pagina > 1) {
        pagina -= 1;
        cargarPeliculas();
    }
});*/

// Observador
let observador = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            pagina++;
            obtenerpeliculas();
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.8
});

const obtenerpeliculas = async() => {
    try {
        const respuesta = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params:{
                //api_key: 'a567aada73ec8ecfd2eff87ae31f7cf2',
                language: 'es-MX',
                page: pagina
            },
            headers:{
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTY3YWFkYTczZWM4ZWNmZDJlZmY4N2FlMzFmN2NmMiIsInN1YiI6IjYxOTY4NmY5YWY1OGNiMDA2NjY1ODllNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hz-PgfjpH39Zkk3CwztJQbq_qdsYUqV_yvdFGz928qo'
            }
        })

        console.log(respuesta);

        if (respuesta.status === 200) {
            const datos = await respuesta.data
            
            datos.results.forEach(pelicula => {
                peliculas += `
                    <div class="pelicula">
                        <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                        <h3 class="titulo">${pelicula.title}</h3>
                    </div>
                `;
            });

            document.getElementById('contenedor').innerHTML = peliculas;

            if (pagina < 1000) {
                if (ultimaPelicula) {
                    observador.unobserve(ultimaPelicula);
                }
    
                const peliculasEnpantalla = document.querySelectorAll('.contenedor .pelicula');
                ultimaPelicula = peliculasEnpantalla[peliculasEnpantalla.length - 1];
                observador.observe(ultimaPelicula);
            }

        } else if (respuesta.status === 401) {
            console.log('Llave equivocada');
        } else if (respuesta.status === 404) {
            console.log('La pelicula no existe');
        } else {
            console.log('Error desconocido');
        }
    } catch (error) {
        console.log(error);
    }
}

obtenerpeliculas()