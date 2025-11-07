projeto nuvem

(MUDAR PARA A ENTREGA)

🏗️ Fase 1: Configuração Inicial e Banco de Dados (RDS)O primeiro passo é estabelecer a base de dados em uma rede privada segura.

1. Configuração de Rede e Segurança (VPC)Crie uma VPC (Virtual Private Cloud) com pelo menos duas sub-redes públicas e duas sub-redes privadas (para alta disponibilidade).Configure um NAT Gateway nas sub-redes públicas para permitir que recursos nas sub-redes privadas acessem a internet (para baixar pacotes, etc.) sem expor seus IPs.Crie Security Groups (Grupos de Segurança) necessários (um para o RDS e outro para o Backend).
2. Configuração do Amazon RDSSelecione o serviço Amazon RDS (MySQL, PostgreSQL ou Aurora Serverless).Crie uma Subnet Group que inclua as sub-redes privadas da sua VPC.Crie a Instância do RDS dentro da Subnet Group privada.Configure o Security Group do RDS para aceitar conexões SOMENTE do Security Group do seu Backend (e não da Internet).Requisito: Instância em subnet privada; sem porta exposta à Internet.
3. Scripts SQL IniciaisCrie os scripts SQL (scripts SQL nos entregáveis):Criação de Tabelas/Objetos: CREATE TABLE ...Inserção de Dados: INSERT INTO ... (dados iniciais/exemplo).Procedures (Selects): SELECT * FROM ... (os selects básicos de CRUD e consultas que a API precisará).


💻 Fase 2: Desenvolvimento do Backend (API REST) e DockerizaçãoAgora que o banco está pronto, você pode construir e empacotar sua aplicação.
1. Desenvolvimento da API RESTEscolha a tecnologia (Node.js, Spring, Flask, etc.).Desenvolva a API REST/JSON que implementará as operações CRUD (Create, Read, Update, Delete) nas tabelas do seu RDS.Configure a conexão com o RDS (utilizando variáveis de ambiente para credenciais, como host, user, password, database).
Testes Locais: Garanta que todos os endpoints CRUD funcionem corretamente se você simular a rede privada (por exemplo, usando SSH Tunneling para o RDS se estiver desenvolvendo localmente).
2. Contêiner e Imagem DockerCrie um Dockerfile para a sua aplicação backend.Garanta que o container rode a API na porta desejada (ex: 8080 ou 3000).Teste a imagem localmente com Docker.


🚀 Fase 3: Deploy do Backend (ECS Fargate ou EC2 + Docker)Esta fase configura o ambiente de hospedagem do seu backend containerizado.
1. Preparação para o ECS/EC2Crie um repositório no Amazon ECR (Elastic Container Registry) para armazenar sua imagem Docker.Se for usar EC2 + Docker: Provisione uma instância EC2 na subnet privada e configure o Docker nela.Se for usar ECS Fargate (Recomendado):Crie um ECS Cluster.Defina uma Task Definition que aponte para a imagem no ECR.Crie um Service que rode a Task Definition nas sub-redes privadas e associe-o a um Load Balancer (ALB).
2. Configuração do Application Load Balancer (ALB)Crie um ALB (Application Load Balancer) nas sub-redes públicas.Configure o Target Group do ALB para rotear o tráfego para a(s) sua(s) Task(s) do ECS ou para a(s) instância(s) EC2.O ALB será o único ponto de entrada para o seu backend.


🌐 Fase 4: Configuração do Gateway e Serverless (API Gateway e Lambda)O ponto de entrada público e a função de relatório serão construídos nesta fase.
1. Configuração do Amazon API GatewayCrie uma nova API REST no Amazon API Gateway.Configure os endpoints CRUD da sua API:Crie os Recursos (ex: /items, /items/{id}).Crie os Métodos (POST, GET, PUT, DELETE).Configure as integrações para apontar para o seu ALB (tipo de integração: HTTP ou VPC Link)
2. Desenvolvimento da Função AWS LambdaDesenvolva o código da Função AWS Lambda (pode ser em Python, Node.js, etc.).O código deve receber uma requisição /report.O Lambda deve fazer uma requisição HTTP para o seu próprio API Gateway (ou diretamente ao ALB) para consumir os dados da API CRUD (ex: um GET /items).Após obter os dados, o Lambda deve processá-los para gerar estatísticas em JSON e retornar o resultado.Requisito: Não acessa o RDS diretamente.3. Integração API Gateway $\to$ LambdaNo API Gateway, crie a rota /report.Configure o método (GET) para integrar-se com a Função Lambda que você criou.


🔁 Fase 5: CI/CD (Opcional, mas Altamente Recomendado +30 Pts)Automatize o processo de deploy da sua aplicação.
1. Infraestrutura como Código (IaC)Escreva o código da sua pipeline (CodePipeline/CodeBuild/ECR/ECS) usando CloudFormation (YAML).
2. Configuração do CodePipelineSource: Configure o CodePipeline para monitorar seu GitHub (ramo main).Build: Configure o CodeBuild para:Pegar o código.Construir a imagem Docker.Testar a aplicação (opcional, mas bom).Fazer push da nova imagem para o ECR.Deploy (ECS Fargate): Configure a etapa de Deploy do CodePipeline para atualizar o ECS Service com a nova imagem do ECR.

📄 Fase 6: Documentação e Entregáveis Finais

1. README.md (GitHub)Inclua instruções de configuração, como rodar localmente, e uma descrição da arquitetura.
2. PDF TécnicoCrie o Diagrama da Arquitetura (VPC, Subnets, RDS, ALB, ECS/EC2, API Gateway, Lambda).Explique o Pipeline CI/CD.Inclua Capturas de Tela dos serviços (RDS, API Gateway, Lambda, ECS/EC2, CodePipeline).Liste as Atividades de Cada Membro (se for em grupo).3. Vídeo Demonstrativo ($\le$ 5 min)Grave a demonstração:Execução das operações CRUD via API Gateway.Chamada da rota /report.Execução do Pipeline CI/CD (o last successful run).Importante: Narração em alta qualidade.
