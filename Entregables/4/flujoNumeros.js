class FlujoNumeros {
    constructor() {
        this.numeros =[6, 1, 4, 3, 10, 9, 8];
    }
    
    siguienteNumero(f) {
        setTimeout(() => {
          let result = this.numeros.shift();
          f(result);
        }, 100);
    }
}


/**
 * Imprime la suma de los dos primeros números del flujo pasado como parámetro.
 */
function sumaDosLog(flujo) {
   let total=new Number(0);
   flujo.siguienteNumero(num => {
        total+=num;
        flujo.siguienteNumero(num => {
            total+=num;
            console.log("Suma de Dos Log: "+total);
        });
    });
   
}

/**
 * Llama a la función f con la suma de los dos primeros números del flujo pasado como parámetro.
 */
function sumaDos(flujo, f) {
    let total=new Number(0);
    flujo.siguienteNumero(num => {
        total+=num;
        flujo.siguienteNumero(num => {
            total+=num;
            f(total);
        });
    });
}

/**
 * Llama a la función f con la suma de todos los números del flujo pasado como parámetro
 */
function sumaTodo(flujo, f, total) {
    if(total===undefined)
        total=new Number(0);
    

    flujo.siguienteNumero(num => {
        
        if(num===undefined){
            //f(values.reduce((acum,n)=>acum+n));
            f(total);
        }else{
            //values.push(num);
            total=total+num;
            sumaTodo(flujo,f,total);
        }
    });
}
 




/* NO MODIFICAR A PARTIR DE AQUÍ */

module.exports = {
    FlujoNumeros: FlujoNumeros,
    sumaDosLog: sumaDosLog,
    sumaDos: sumaDos,
    sumaTodo: sumaTodo
}

sumaDosLog(new FlujoNumeros());
sumaDos(new FlujoNumeros(), suma => {console.log(`El resultado de la suma de los dos primeros números es ${suma}`);});
sumaTodo(new FlujoNumeros(), suma => {
console.log(`El resultado de la suma de todos los números es ${suma}`);
});

