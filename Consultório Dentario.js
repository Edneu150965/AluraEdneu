<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assistente Virtual - Clínica Dental</title>
    <style>
        :root {
            --primary: #00A884; /* Verde WhatsApp */
            --secondary: #128C7E;
            --error: #FF5252;
            --text: #333;
            --bg: #f5f5f5;
        }
        
        #chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
            color: blue;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: transform 0.3s;
        }
        
        #chatbot-toggle:hover {
            transform: scale(1.1);
        }
        
        #chatbot-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
            overflow: hidden;
            background: white;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s;
        }
        
        #chatbot-container.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        #chatbot-header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 20px;
            font-weight: 600;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: var(--bg);
        }
        
        .message {
            margin-bottom: 12px;
            padding: 10px 15px;
            border-radius: 12px;
            max-width: 80%;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .bot-message {
            background: white;
            border-radius: 12px 12px 12px 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            align-self: flex-start;
        }
        
        .user-message {
            background: var(--primary);
            color: white;
            border-radius: 12px 12px 0 12px;
            margin-left: auto;
        }
        
        .system-message {
            background: #f0f0f0;
            color: var(--text);
            text-align: center;
            margin: 10px auto;
            font-size: 12px;
        }
        
        .quick-replies {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        
        .quick-reply {
            background: white;
            border: 1px solid var(--primary);
            color: var(--primary);
            padding: 6px 12px;
            border-radius: 18px;
            margin: 0 5px 5px 0;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        
        .quick-reply:hover {
            background: var(--primary);
            color: white;
        }
        
        #chatbot-input-container {
            padding: 12px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
        }
        
        #user-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
            transition: border 0.3s;
        }
        
        #user-input:focus {
            border-color: var(--primary);
        }
        
        #send-button {
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background 0.3s;
        }
        
        #send-button:hover {
            background: var(--secondary);
        }
        
        .typing-indicator {
            display: flex;
            padding: 10px 15px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #ccc;
            border-radius: 50%;
            margin: 0 2px;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        .hidden {
            display: none !important;
        }
        
        .error-message {
            color: var(--error);
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <!-- Botão flutuante -->
    <div id="chatbot-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    </div>

    <!-- Container do Chatbot -->
    <div id="chatbot-container">
        <div id="chatbot-header">
            <span>Assistente Dental</span>
            <span id="close-chatbot" style="cursor: pointer; font-size: 24px;">×</span>
        </div>
        <div id="chatbot-messages"></div>
        <div id="chatbot-input-container">
            <input type="text" id="user-input" placeholder="Digite sua mensagem..." autocomplete="off">
            <button id="send-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>

    <script>
        // Banco de dados simulado (usando localStorage)
        const database = {
            appointments: JSON.parse(localStorage.getItem('appointments')) || [],
            procedures: [
                { id: 1, name: "Consulta de Rotina", duration: 30 },
                { id: 2, name: "Limpeza Dental", duration: 45 },
                { id: 3, name: "Clareamento", duration: 60 },
                { id: 4, name: "Ortodontia", duration: 30 },
                { id: 5, name: "Extração", duration: 60 }
            ],
            availableSlots: [
                "Segunda, 10:00",
                "Segunda, 14:00",
                "Terça, 09:00",
                "Quarta, 15:00",
                "Quinta, 11:00",
                "Sexta, 16:00"
            ],
            
            saveAppointment(appointment) {
                this.appointments.push(appointment);
                localStorage.setItem('appointments', JSON.stringify(this.appointments));
            },
            
            cancelAppointment(phone) {
                this.appointments = this.appointments.filter(app => app.phone !== phone);
                localStorage.setItem('appointments', JSON.stringify(this.appointments));
            },
            
            findAppointment(phone) {
                return this.appointments.find(app => app.phone === phone);
            }
        };

        // Estado do chatbot
        const state = {
            currentStep: 'welcome',
            tempData: {},
            previousStates: []
        };

        // Elementos DOM
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        const closeChatbot = document.getElementById('close-chatbot');
        const chatMessages = document.getElementById('chatbot-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');

        // Inicialização
        function init() {
            // Event listeners
            chatbotToggle.addEventListener('click', toggleChatbot);
            closeChatbot.addEventListener('click', toggleChatbot);
            sendButton.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
            
            // Mostra mensagem inicial quando aberto
            chatbotToggle.addEventListener('click', () => {
                if (!chatbotContainer.classList.contains('active') {
                    setTimeout(() => {
                        showBotMessage("Olá! Sou o assistente virtual da Clínica Dental Sorriso Perfeito. Como posso ajudar?", [
                            { text: "Agendar consulta", action: "start_booking" },
                            { text: "Cancelar consulta", action: "start_cancellation" },
                            { text: "Remarcar consulta", action: "start_reschedule" }
                        ]);
                    }, 500);
                }
            });
        }

        // Mostra/oculta o chatbot
        function toggleChatbot() {
            chatbotContainer.classList.toggle('active');
            if (chatbotContainer.classList.contains('active')) {
                chatbotContainer.style.opacity = '1';
                chatbotContainer.style.transform = 'translateY(0)';
                userInput.focus();
            }
        }

        // Adiciona mensagem ao chat
        function addMessage(text, type = 'bot', quickReplies = []) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            
            if (type === 'bot') {
                messageDiv.classList.add('bot-message');
                messageDiv.innerHTML = text;
                
                if (quickReplies.length > 0) {
                    const quickRepliesDiv = document.createElement('div');
                    quickRepliesDiv.classList.add('quick-replies');
                    
                    quickReplies.forEach(reply => {
                        const replyBtn = document.createElement('div');
                        replyBtn.classList.add('quick-reply');
                        replyBtn.textContent = reply.text;
                        replyBtn.addEventListener('click', () => handleQuickReply(reply.action));
                        quickRepliesDiv.appendChild(replyBtn);
                    });
                    
                    messageDiv.appendChild(quickRepliesDiv);
                }
            } else if (type === 'user') {
                messageDiv.classList.add('user-message');
                messageDiv.textContent = text;
            } else if (type === 'system') {
                messageDiv.classList.add('system-message');
                messageDiv.textContent = text;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Mostra mensagem do bot com efeito de digitação
        function showBotMessage(text, quickReplies = []) {
            // Mostra indicador de digitação
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('typing-indicator');
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Remove o indicador e mostra a mensagem após um delay
            setTimeout(() => {
                chatMessages.removeChild(typingDiv);
                addMessage(text, 'bot', quickReplies);
            }, 1000 + Math.random() * 1000);
        }

        // Envia mensagem do usuário
        function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;
            
            addMessage(message, 'user');
            userInput.value = '';
            
            // Processa a resposta do usuário
            processUserResponse(message);
        }

        // Processa respostas do usuário
        function processUserResponse(response) {
            switch (state.currentStep) {
                case 'welcome':
                    handleWelcomeResponse(response);
                    break;
                case 'get_name':
                    state.tempData.name = response;
                    state.currentStep = 'get_phone';
                    showBotMessage("Ótimo! Qual é o seu telefone para contato? (Com DDD)");
                    break;
                case 'get_phone':
                    if (/^(\d{10,11})$/.test(response)) {
                        state.tempData.phone = response;
                        state.currentStep = 'get_procedure';
                        showProcedures();
                    } else {
                        showBotMessage("Por favor, digite um telefone válido com DDD (ex: 11987654321).");
                    }
                    break;
                case 'get_procedure':
                    const procedure = database.procedures.find(p => 
                        p.name.toLowerCase().includes(response.toLowerCase())
                    );
                    
                    if (procedure) {
                        state.tempData.procedure = procedure.name;
                        state.currentStep = 'get_date';
                        showAvailableSlots();
                    } else {
                        showBotMessage("Procedimento não encontrado. Escolha um da lista:");
                        showProcedures();
                    }
                    break;
                case 'get_date':
                    if (database.availableSlots.includes(response)) {
                        state.tempData.date = response;
                        state.currentStep = 'confirm';
                        showConfirmation();
                    } else {
                        showBotMessage("Horário inválido. Escolha um dos disponíveis:");
                        showAvailableSlots();
                    }
                    break;
                case 'confirm':
                    if (response.toLowerCase() === 'sim' || response.toLowerCase() === 's') {
                        database.saveAppointment(state.tempData);
                        sendConfirmationEmail(state.tempData);
                        showBotMessage(`✅ Agendamento confirmado para ${state.tempData.date}! Enviaremos um lembrete por SMS. Obrigado!`);
                        addMessage("Deseja fazer outra operação?", 'system', [
                            { text: "Voltar ao início", action: "reset" }
                        ]);
                    } else {
                        showBotMessage("Agendamento cancelado. Posso ajudar com algo mais?");
                        state.currentStep = 'welcome';
                    }
                    break;
                case 'cancel_confirm':
                    if (response.toLowerCase() === 'sim' || response.toLowerCase() === 's') {
                        database.cancelAppointment(state.tempData.phone);
                        showBotMessage("✅ Consulta cancelada com sucesso. Sentiremos sua falta!");
                        addMessage("Deseja fazer outra operação?", 'system', [
                            { text: "Voltar ao início", action: "reset" }
                        ]);
                    } else {
                        showBotMessage("Operação cancelada. Posso ajudar com algo mais?");
                        state.currentStep = 'welcome';
                    }
                    break;
                case 'get_cancel_phone':
                    const appointment = database.findAppointment(response);
                    if (appointment) {
                        state.tempData = { ...appointment };
                        state.currentStep = 'cancel_confirm';
                        showBotMessage(`Encontrei seu agendamento para ${appointment.procedure} no dia ${appointment.date}. Confirmar cancelamento? (Sim/Não)`);
                    } else {
                        showBotMessage("Nenhum agendamento encontrado com este telefone. Verifique o número e tente novamente.");
                    }
                    break;
                default:
                    state.currentStep = 'welcome';
                    showBotMessage("Desculpe, não entendi. Vamos começar novamente.");
            }
        }

        // Mostra procedimentos disponíveis
        function showProcedures() {
            const proceduresList = database.procedures.map(p => p.name).join(", ");
            showBotMessage(`Qual destes procedimentos você deseja? ${proceduresList}`);
        }

        // Mostra horários disponíveis
        function showAvailableSlots() {
            showBotMessage(`Horários disponíveis para ${state.tempData.procedure}:<br><br>${database.availableSlots.join("<br>")}`);
        }

        // Mostra confirmação do agendamento
        function showConfirmation() {
            const { name, procedure, date } = state.tempData;
            showBotMessage(`Confirme os dados:<br><br>
                📌 Nome: ${name}<br>
                🦷 Procedimento: ${procedure}<br>
                📅 Data: ${date}<br><br>
                Confirmar agendamento? (Sim/Não)`);
        }

        // Simula envio de e-mail
        function sendConfirmationEmail(data) {
            console.log(`E-mail enviado para ${data.name} (${data.phone}): Consulta marcada para ${data.date}`);
            // Em produção, integraria com SendGrid, Mailchimp, etc.
        }

        // Lida com respostas rápidas
        function handleQuickReply(action) {
            switch (action) {
                case 'start_booking':
                    state.currentStep = 'get_name';
                    state.tempData = {};
                    showBotMessage("Ótimo! Qual é o seu nome completo?");
                    break;
                case 'start_cancellation':
                    state.currentStep = 'get_cancel_phone';
                    state.tempData = {};
                    showBotMessage("Para cancelar, digite o telefone usado no agendamento:");
                    break;
                case 'start_reschedule':
                    state.currentStep = 'get_cancel_phone';
                    state.tempData = { reschedule: true };
                    showBotMessage("Para remarcar, digite o telefone usado no agendamento:");
                    break;
                case 'reset':
                    state.currentStep = 'welcome';
                    showBotMessage("Como posso ajudar?", [
                        { text: "Agendar consulta", action: "start_booking" },
                        { text: "Cancelar consulta", action: "start_cancellation" },
                        { text: "Remarcar consulta", action: "start_reschedule" }
                    ]);
                    break;
            }
        }

        // Inicia o chatbot
        init();
    </script>
</body>
</html>