import Html2Pdf from 'html2pdf.js';
import axios from 'axios';

const App = () => {
  const PrintPDf = useReactToPrint({
    onPrintError: (error) => console.log(error),
    content: () => documentRef.current,
    removeAfterPrint: true,

    print: async (printIframe) => {
      const document =
        printIframe.contentDocument.getElementsByTagName('html')[0];

      let worker = await Html2Pdf()
        .from(document)
        .toPdf()
        .output('blob')
        .then((data) => {
          return data;
        });
      const file = new File([worker], 'myTest1.pdf', {
        type: 'application/pdf',
      });

      sendPdf(file);
    },
  });

  const sendPdf = (file) => {
    let phoneNumber = '543512735687';
    let fileReader = new FileReader();
    fileReader.onload = async function (fileLoadedEvent) {
      file = fileLoadedEvent.target.result;
      let jsonFile = { file, phoneNumber };

      axios.defaults.headers.common['Authorization'] =
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOnsidXVpZCI6IjQ5NTM0NTczNDg5NTczNDg5NzUiLCJpc0FkbWluIjpmYWxzZSwidXNlcklkIjoiQURNSU4ifSwiaWF0IjoxNjc0Njc3MDQyLCJleHAiOjE2NzQ3NjM0NDJ9.9zAFBnFWCndA5KLUAbQligjT7DN83gKqDAQieQm9ShQ';

      await axios
        .post(`https://pruebaapivanguard.procomisp.com.ar/v5/wpdf`, jsonFile)
        .then((response) => console.log('response: ', response))
        .catch((error) => console.log(error));
    };
    fileReader.readAsDataURL(file);
    //setDeuda({});
  };

  return (
    <div>
      <h1>Hola</h1>
    </div>
  );
};

export default App;
