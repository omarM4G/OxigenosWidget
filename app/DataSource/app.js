var stringsnam1 = "WelcomeBack";
var id_registro = "";

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello!',
    entity: {
      id: null,
      module: null,
    },
    Datos_principal: {
      nombre_pdf: null,
      nombre: null,
      precio_Lista: null,
      cantidad: null,
      MotorTipo: null,
      motorcilindrada: null,
      hp_max: null,
      tp_alimenta: null,
      transmision: null,
      montoUSD: null,
      frenosMoto: null,
      ruedDelant: null,
      ruedapost: null,
      suspension_Delant: null,
      suspension_Post: null,
      Dimensiones: null,
      Applargo: null,
      Appancho: null,
      Appaltura: null,
      Peso: null,
      cap_deTank: null,
      torquemaximo: null
    },
    cargado: false,
    Imagenes: []
  },
  methods: {
    onLoad: function () {
      const self = this;
      ZOHO.embeddedApp.on("PageLoad", async function (data) {
        console.log(data);
        self.entity.id = data.EntityId[0];
        self.entity.module = data.Entity;

        await self.getDataFromZoho(self.entity.id);

      });
    },
    initZSDK: function () {
      const self = this;
      ZOHO.embeddedApp.init()
        .then(function () {
          ZOHO.CRM.UI.Resize({
            height: "780",
            width: "840"
          })
        });
    },
    getDataFromZoho: async function (id) {
      // https://www.zohoapis.com/crm/v2/functions/sa_get_all_data/actions/execute?auth_type=oauth
      //OBTENEMOS LA DATA
      const self = this;
      var func_name = "contenidowidgetdealsguiaremi";
      id_registro = id;
      var req_data = {
        "arguments": JSON.stringify({
          "id": id,
        })
      };
      let datosFromZoho = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
      let datos = datosFromZoho.details.output;
      let datos_object = JSON.parse(datos);
      console.log(datos_object);
      //-------------------------------
      this.Datos_principal.nombre = true;
      //this.Datos_principal.nombre_pdf = "PDF_r";

      console.log("hola");
      console.log(this.Datos_principal.nombre_pdf);


      if (self.Datos_principal.nombre == true) {
        document.getElementById("miCheckbox").checked = true;
      }

      console.log(datosFromZoho);
      return datosFromZoho;


    },

    GenerarPDf: async function () {

      //const $boton = document.querySelector("#btnCrearPdf");
      //const $element = document.getElementById("element");
      //console.log("Nombre de PDF: "+ this.seccion_Html.NameProduct);
      // $boton.addEventListener("click", () => {
      // const $elementoParaConvertir = document.body; // <-- Aquí puedes elegir cualquier elemento del DOM
      /* html2pdf()
           .set({
               margin: [0.03,0.03],
               filename: "hello"+".pdf",
               image: {
                   type: 'jpeg',
                   quality: 0.98
               },
               html2canvas: {
                   scale: 4, // A mayor escala, mejores gráficos, pero más peso
                   letterRendering: true,
               },
               jsPDF: {
                   unit: "in",
                   format: "a4",
                   orientation: 'portrait' // landscape o portrait
               }
           })*/
      //.from($element)
      //.save()
      //.catch(err => console.log(err));
      //Version en uso debajo:
      var paramPDf = {
        margin: [0.03, 0.03],
        filename: this.Datos_principal.nombre_pdf,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 4, // A mayor escala, mejores gráficos, pero más peso
          letterRendering: true,
          userCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: 'landscape' // landscape o portrait
        }
      };
      var ArchivoPDF_Generado;
      try {
        ArchivoPDF_Generado = await html2pdf().set(paramPDf).from(document.getElementById('element')).outputPdf();
        //Removiendo Modal para que no aparezca en PDF
        modal.parentNode.removeChild(modal);
        ArchivoPDF_Generado = await html2pdf().set(paramPDf).from(document.getElementById('element')).outputPdf().save();
      } catch (error1) {
        console.log("Generador PDF Fallo =>" + error1); 
      }
      console.log(this.Datos_principal.nombre_pdf);
      console.log(paramPDf);

      /*  const forPDF = document.getElementById('element');
        //html2canvas
        const pdfResponse = await html2pdf(forPDF).then(async (canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190;
          const pageHeight = 295;
          let imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          const doc = new jsPDF('p', 'mm', "a4");
          let position = 0;
          doc.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight + 10);
          heightLeft -= pageHeight;
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight + 10);
            heightLeft -= pageHeight;
          }
          return doc.output('blob');
        })
pdfResponse
        */
      let fileVar = new Blob([ArchivoPDF_Generado], { type: "application/octet-stream",});
      console.log(fileVar);
      let formdata = new FormData();
      let headers = new Headers();
      formdata.append('archivo', fileVar);
      headers.append('Access-Control-Allow-Origin', 'https://0df37860-54ed-4d6f-8175-ecf7400cbbdb.zappsusercontent.com');
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        headers: headers
      };
      let objeto;
      let message = '';

      //try {
        await fetch("https://solucionesm4g.site:8443/files/api-touring-people/uploadPdf", requestOptions)
          .then((response) => response.json())
          .then(data => {
            objeto = data?.id;
            message = data?.mensaje;
          })
          objeto = objeto.substr(0, objeto.indexOf("blob")) + "generated.pdf"; 
          console.log("archisvos adjutnos URL => respuesta: "+message +"\n"+"objeto: "+objeto);
      //} catch (DocumentoLinkError) {
       // console.log("fallo url de adjuntos =>" + DocumentoLinkError); 
        message = "no_data";
     // }
      if ( objeto != "".includes("Exito")) {
        var func_name_r = "testdatos";
        //const model = message;
        //const data = {"arguments": JSON.stringify({"param1": "Omar EL mensaje si llego","accion": "send_mail","id_file": objeto})};
        var req_data_1 = {
          "arguments": JSON.stringify({
            "id_registro": id_registro,
            "link_DocAdjunto": objeto,
            "modulo_origen": "Deals"
          })
        };
        await ZOHO.CRM.FUNCTIONS.execute(func_name_r, req_data_1).then(res => {
          message = res.details?.output
          console.log("Funcion deluge recibe data =>" + message);
        })

        modal.style.display = "block";
      }
      //swal('', message, "success"); 
    }
  },
  created: function () {
    this.onLoad();
    this.initZSDK();
    // this.getDataFromZoho();
    ZOHO.embeddedApp.init();
  },
})
///// Generacion PDF:



document.addEventListener("DOMContentLoaded", () => {
  // Escuchamos el click del botón
});

let button = document.getElementById("btnCrearPdf");

button.addEventListener("click", function () {
  button.style.display = "none";
});

document.getElementById("btnCrearPdf").onclick = function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute("style", "position:absolute;top:40%;left:20%;background-color:white;");
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}

// Get the modal
var modal = document.getElementById("miModal");

// Get the button that opens the modal
var btn = document.getElementById("btnCrearPdf");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display="block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Obtener la referencia al modal
var modal = document.getElementById("miModal");

// Programar el cierre del modal después de 5 segundos (5000 milisegundos)
setTimeout(function () {
  modal.style.display = "none";

}, 5100);

const btt = document.getElementById('btnCrearPdf');

btt.addEventListener('click', function () {

  setTimeout(function () {
    // Código para cerrar el widget aquí
    ZOHO.CRM.UI.Popup.close()
      .then(function (data) {
        console.log(data)
      })
  }, 5000);
  //4100
})