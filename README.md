# n8n-nodes-gemini-fci

Node personalizado do Google Gemini para n8n com autenticação direta (URL e API Key) - FCI

## 📋 Descrição

Este é um node customizado para n8n que permite interagir com a API do Google Gemini usando autenticação direta através de campos de URL e API Key, sem necessidade de configurar credenciais no n8n.

## ✨ Características

- **Autenticação Direta**: Campos diretos para Server URL e API Key
- **Funcionalidade Completa**: Todos os recursos do node original do Google Gemini
- **Fácil Configuração**: Apenas dois campos para configurar
- **Compatibilidade**: Totalmente compatível com n8n

## 🚀 Instalação

```bash
npm install n8n-nodes-gemini-fci
```

## ⚙️ Configuração

### Campos Obrigatórios

1. **Server URL**: URL da API do Google Gemini
   - Padrão: `https://generativelanguage.googleapis.com`
   - Pode ser customizada para diferentes endpoints

2. **API Key**: Chave da API do Google Gemini
   - Campo obrigatório
   - Armazenado de forma segura

## 📚 Recursos Disponíveis

### Text
- **Message**: Enviar mensagens para modelos de texto

### Image
- **Analyze**: Analisar imagens
- **Generate**: Gerar imagens

### Video
- **Analyze**: Analisar vídeos
- **Generate**: Gerar vídeos
- **Download**: Baixar vídeos

### Audio
- **Transcribe**: Transcrever áudio
- **Analyze**: Analisar áudio

### Document
- **Analyze**: Analisar documentos

### File
- **Upload**: Fazer upload de arquivos

## 🔧 Desenvolvimento

### Pré-requisitos

- Node.js >= 18.10
- npm ou pnpm

### Instalação de Dependências

```bash
npm install
```

### Compilação

```bash
npm run build
```

### Desenvolvimento

```bash
npm run dev
```

## 📦 Estrutura do Projeto

```
src/
├── nodes/
│   └── GoogleGeminiFCI/
│       ├── actions/
│       │   ├── audio/
│       │   ├── document/
│       │   ├── file/
│       │   ├── image/
│       │   ├── text/
│       │   ├── video/
│       │   ├── router.ts
│       │   └── versionDescription.ts
│       ├── helpers/
│       ├── methods/
│       ├── transport/
│       ├── GoogleGeminiFCI.node.ts
│       └── gemini.svg
└── index.ts
```

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Mateus Gomes**
- Email: mateusgomes@example.com
- GitHub: [@FazcomIA](https://github.com/FazcomIA)

## 🙏 Agradecimentos

- Baseado no node oficial do Google Gemini do n8n
- Comunidade n8n por fornecer a base para desenvolvimento de nodes customizados

## 📞 Suporte

Para suporte, entre em contato através do GitHub ou email.
