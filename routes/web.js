const FileConroller = require('../controllers/fileController');

function rest(app) {
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"Hello guys"});
    });
    app.get('/files/:uuid',FileConroller().Download);
    app.get('/files/download/:uuid',FileConroller().Dow);
    app.post('/api/files',FileConroller().FileSubmit);
    app.post('/api/files/send',FileConroller().Email);
}

module.exports = rest;