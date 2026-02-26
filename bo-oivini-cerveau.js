const express=require('express');const app=express();const collab=require('./modules/collab');
app.get('/peginti/router',(req,res)=>{const q=req.query.q||"test";res.json(collab.router(q));});
app.get('/',(req,res)=>{const chat=req.query.chat||"test";const route=collab.router(chat);res.json({message:"PEGINTICHAT",chat:chat,reponse:"👁️BIP: Réponse communautaire générée",module:route.module,status:route.confiance+"%" });});
app.get('/booivini/chat',(req,res)=>{if(req.get('Authorization')!=='TomTech')return res.status(401).json({error:"Premium"});res.json({assistant:"Bo'oivinichat",reponse:"💎 PREMIUM: Solution entreprise TomTech.inc",status:"95%"});});
app.listen(3000,()=>console.log('🧠BO\'OIVINI v3.1 FIX'));
