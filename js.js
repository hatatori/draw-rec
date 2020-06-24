//escolher com audio ou sem audio

escolha = document.querySelectorAll("input[name='esc']:checked")[0].value
escolha = parseInt(escolha)


x = 0
y = 0

		// botoes

		btplay = 0

		function videoplay(n){	btplay = n 	}

	//cor tamanho 
	cor = 'black'
	tamanho_pincel = 1

	// cores
	numero_cor = 0
	cores = ['black','#2980b9','orangered','white'] //black blue orangered


	// quadro
	ctx = myCanvas.getContext('2d')
	ctx.fillStyle = cores[3];
	
	ctx.fillRect(0, 0, 1920, 1080); //x y w h

	function line(x0,y0,x1,y1){

		dx = x1-x0
		dy = y1-y0

		m = dy/dx
		
		distance = dx == 0 ? Math.abs(dy) : Math.abs(dx)

		for(i=0;i<distance;i+=0.1){

			sx = parseInt(Math.round( dx>0 ? x0+i : x0-i ))
			sy = parseInt(Math.round( dx>0 ? y0+i*m : y0+i*m*-1 ))
			
			pixel(sx,sy)

			if(dx==0) pixel(x0,y0 += dy > 0 ? 0.1 : -0.1) ;
		}
	}

	function line2(x0,y0,x1,y1){
		ctx.strokeStyle=cor
		ctx.beginPath();
		ctx.moveTo(x0,y0);
		ctx.lineTo(x1,y1);
		ctx.stroke();
	}

	function pixel(x,y){
		ctx.beginPath();
		ctx.fillStyle = cor
		ctx.fillRect(x, y, tamanho_pincel, tamanho_pincel);
		ctx.stroke();
		ctx.closePath();
	}

	function Clear(){ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1920, 1080);}
	

	movimento = []

	mouse = {

		history:[],
		ar:[],

		move:function(x,y){ 
			cursor.style.transform="translate("+(x-16)+"px,"+(y-11)+"px)" 
		},

		add:function(x,y,b,c){ 
			this.history.push({x,y,b,c}) ; this.ar.push(x+","+y+","+b+","+c) 
		},

		pos(n){

			this.move(this.history[n].x,this.history[n].y)

			if(this.history[n].b == 1){
				try{
					cor = cores[this.history[n].c]

					// line(this.history[n].x,this.history[n].y,this.history[n-1].x,this.history[n-1].y)
					
					ctx.beginPath();
					ctx.moveTo(this.history[n].x,this.history[n].y);
					ctx.lineTo(this.history[n-1].x,this.history[n-1].y);
					ctx.stroke();

				}
				catch(e){}
			}
		},

		pos2(n){

			this.move(this.history[n].x,this.history[n].y)

			if(this.history[n].b == 1){
				try{
					cor = cores[this.history[n].c]
					line(this.history[n].x,this.history[n].y,this.history[n-1].x,this.history[n-1].y)
				}
				catch(e){}
			}
		}

	}

//redesenha tudo do tempo zero até o tempo escolhido
function desfazerTempo(tempo){
	Clear();
	for(t1=0;t1<tempo;t1++)
		mouse.pos(t1)
}

function desfazerTempo2(tempo){
	Clear();
	for(t1=0;t1<tempo;t1++)
		mouse.pos2(t1)
}


// gravar o mouse
flag = false

function recordMouse(flag){
	if(flag){
		s = setInterval(e=>{
			mouse.add(mouse.x, mouse.y, mouse.b, numero_cor)
			timeline.max = mouse.history.length-1
		},0)
	}else{
		clearInterval(s)
	}
}


myCanvas.onmousemove=function(e){

	try{
		x0 = mouse.x
		y0 = mouse.y
	}catch(e){
		x0 = 0
		y0 = 0
	}

	mouse.x = e.offsetX
	mouse.y = e.offsetY
	mouse.b = e.buttons



	if(mouse.b)
		line2(x0,y0,mouse.x,mouse.y)
}	

window.onclick=function(){pixel(mouse.x,mouse.y)}

window.onkeyup=function(e){

	if(e.key == "1") recordMouse(true); 
	if(e.key == "2") recordMouse(false); 


	if(e.key == "+") tamanho_pincel++;
	if(e.key == "-") tamanho_pincel--;
	if(e.key == "\'") btplay = (btplay==1) ? 0 :  1;
	if(e.key == " ") btplay = (btplay==1) ? 0 :  1;
	if(e.key == " ") audio.paused = (!audio.paused) ? audio.pause() :  audio.play();


	switch(e.key){
		case 'z': cor="black" ; break
		case 'x': cor="orangered" ; break
		case 'c': cor="blue" ; break
		case 'v': cor="green" ; break
		case '*': desfazerTempo2(timeline.value)
	}

	// cor = cores[numero_cor]; $$('.quadrado')[numero_cor].click()


}

// function $$(e){return document.querySelectorAll(e)}

		//carrega arquivo
		file = window.location.hash.substring(1)
		file = file.split("#")[0]	
		audio.src = file+".wma"

		fetch(file+'.txt').then(e=>e.text().then(e=>{

			el = e.split(' ')

			for(i of el){
				k = i.split(',').map(e=>parseInt(e))
				ob = {x:k[0],y:k[1],b:k[2],c:k[3]}
				mouse.history.push(ob)
				if(mouse.history.length == el.length)
					timeline.max = mouse.history.length
			}
		}))


		//gravar audio
		

		function gravarAudio(){
			
			escolha = document.querySelectorAll("input[name='esc']:checked")[0].value
			escolha = parseInt(escolha)


			numero = typeof(numero) == 'undefined' || numero == 0 ? 1 : 0
			
			numero%2==1 ? recordMouse(true) : recordMouse(false)

			console.log(numero)

			// numero == 0 ? mediaRecorder.stop() : null
			

			if(escolha){
				
				numero%2==0 ? mediaRecorder.stop() : null

				navigator.mediaDevices.getUserMedia({audio:true})
				.then(stream => {
					mediaRecorder = new MediaRecorder(stream)
					mediaRecorder.start()
					chuck = []

					mediaRecorder.addEventListener('dataavailable',e=>{
						chuck.push(e.data)
					})

					mediaRecorder.addEventListener('stop', e=>{

						blob = new Blob(chuck,{type:'audio/wma'})
						audio_url = URL.createObjectURL(blob)

						audio = new Audio(audio_url)

						audio.style.width=600
						audio.setAttribute("controls",1)

						bloco.appendChild(audio)

						if(!audio.paused)
							audio.play()

						videoplay(1)

					})
				})
			}
		}		



		//consegue a duração do áudio
		fim = 0
		if(fim==0){
			audio.currentTime=9000
			audio.play()
			fim++
		}

		function sincroniza(valor){ 

			aux = audio.paused

			if(aux == true){
				audio.pause()
			}

			if(mouse.b){
				audio.currentTime = parseInt(valor) * audio.duration / parseInt(timeline.max) 
			}

		}

		function sincroniza2(){ audio.currentTime = parseInt(valor) * audio.duration / parseInt(timeline.max) }

		//baixa
		function fileDown(){

			text = mouse.ar.join(" ")
			blob = new Blob([text], {type: "text/plain"});
			url = window.URL.createObjectURL(blob);
			a = document.createElement("a");
			a.href = url;
			a.download = 'ok.txt';  
			a.click();

			a.href = audio_url;
			a.download = 'ok.wma';  
			a.click();
		}

		setInterval(()=>{

			if(btplay){
				timeline.value++
				// mouse.move(mouse.history[timeline.value].x,mouse.history[timeline.value].y)
				risca(timeline.value)
			}

			if(!audio.paused){
				timeline.value = audio.currentTime*timeline.max/audio.duration
				mouse.move(mouse.history[timeline.value].x,mouse.history[timeline.value].y)
				risca(timeline.value)
			}


		},0)

		
		//100 para trás
		function risca(n){
			try{
				for(k=0;k<1;k++){
					if(mouse.history[n-k].b){
						line2(mouse.history[n-k].x,mouse.history[n-k].y,mouse.history[n-k+1].x,mouse.history[n-k+1].y)
						// cor = cores[mouse.history[n-k].c]
						// line(mouse.history[n-k].x,mouse.history[n-k].y,mouse.history[n-k+1].x,mouse.history[n-k+1].y)

					}
				}
			}catch(e){}
		}

		// @conteudo@
		//pega o conteudo que tá entre as arrobas link 

		try{
			link = window.location.href
			msg = decodeURI(link.match(/@(.+)@/i)[1])
			questao.innerHTML = msg
		}catch(e){}




		