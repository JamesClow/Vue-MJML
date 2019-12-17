import VUE from 'vue';
import FS from "fs";
import MJML from 'mjml';
import { createRenderer } from 'vue-server-renderer';

export function renderEmail(file_name, email_data){
  return new Promise((resolve, reject)=>{
    var file_path = './campaigns/'+file_name+'.mjml';
    if(FS.existsSync(file_path)){
      var app = new VUE({
        data: email_data,
        template: FS.readFileSync(file_path, 'utf-8')
      })
      createRenderer().renderToString(app, (err, vue_render)=>{
        if(err){
          reject('Error at Vue compiler'+err)
        }else{
          var mjml_render = MJML(vue_render);
          if(mjml_render.html){
            resolve(mjml_render.html)
          }else{
            reject(err)
          }
        }
      })
    }else{
      reject('Could not find template: ./campaigns/'+file_name+'.mjml')
    }
  })
}
