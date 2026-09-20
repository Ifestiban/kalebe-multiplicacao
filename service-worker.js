// ==========================================================
// KALEBE - AVENTURA DA MULTIPLICAÇÃO
// SERVICE WORKER
// ==========================================================


// ==========================================================
// VERSÃO DO CACHE
// ==========================================================

const CACHE = "kalebe-v2";


// ==========================================================
// ARQUIVOS PRINCIPAIS DO JOGO
// ==========================================================

const FILES = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json",


    // ======================================================
    // IMAGENS
    // ======================================================

    "./imagens/kalebe.png",

    "./imagens/favicon.png",

    "./imagens/icon-192.png",

    "./imagens/icon-512.png",

    "./imagens/icon-maskable-512.png",


    // ======================================================
    // MÚSICA
    // ======================================================

    "./sounds/background.ogg",


    // ======================================================
    // EFEITOS SONOROS
    // ======================================================

    "./sounds/attack.wav",

    "./sounds/coin.wav",

    "./sounds/correct.wav",

    "./sounds/defeat.wav",

    "./sounds/monster-hit.wav",

    "./sounds/unlock.wav",

    "./sounds/victory.wav",

    "./sounds/wrong.wav"

];


// ==========================================================
// INSTALAÇÃO
// ==========================================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE)
                .then(cache => {

                    return cache.addAll(
                        FILES
                    );

                })

        );


        /*
            Ativa imediatamente a nova
            versão do Service Worker.
        */

        self.skipWaiting();

    }
);


// ==========================================================
// ATIVAÇÃO
// ==========================================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames
                            .filter(
                                cacheName =>
                                    cacheName !== CACHE
                            )
                            .map(
                                cacheName =>
                                    caches.delete(
                                        cacheName
                                    )
                            )

                    );

                })

        );


        /*
            Assume imediatamente o controle
            das páginas abertas.
        */

        self.clients.claim();

    }
);


// ==========================================================
// INTERCEPTAR REQUISIÇÕES
// ==========================================================

self.addEventListener(
    "fetch",
    event => {

        /*
            Trabalhamos apenas com GET.
        */

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(response => {

                    /*
                        Se estiver no cache,
                        utiliza o arquivo salvo.
                    */

                    if (response) {

                        return response;

                    }


                    /*
                        Caso contrário,
                        busca normalmente.
                    */

                    return fetch(
                        event.request
                    );

                })

        );

    }
);