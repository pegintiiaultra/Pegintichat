'use strict';
const express=require('express');const collab=require('./modules/collab');const app=express();
app.get('/peginti/router',(req,res)=>{const question=req.query.q||"test";res.json(collab.router(question));});
app.get('/',(req,res)=>{const chat=req.query.chat||"Bienvenue";const route=collab.router(chat);if(route.destination==="PEGINTICHAT"){res.json({message:'PEGINTICHAT - Communauté Afrique',hemisphere:'GAUCHE',question:chat,reponse:`👁️ BIP: "${chat}" → Réponse communautaire.`,module:route.module,status:route.status});}else{res.json({redirect:"Bo'oivinichat",message:"Question premium"});}});
app.get('/booivini/chat',(req,res)=>{const message=req.query.message||"test";const auth=req.get('Authorization')||'none';if(auth!=='TomTech'){return res.status(401).json({error:'🔐 TomTech Premium requis'});}const route=collab.router(message);res.json({hemisphere:'DROIT',assistant:"Bo'oivinichat PRO",question:message,reponse:`💎 [${route.module}]: "${message}" → Solution TomTech.inc.`,status:'premium',confiance:route.confiance});});
app.listen(3000,()=>{console.log('🧠 BO\'OIVINI v2.0 - Routage intelligent OK');});
