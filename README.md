# 🗂️ Cartório Digital

### Transformando processos manuais em soluções digitais eficientes.

**Sistema de Digitalização de Documentos Cartoriais — Trabalho de Conclusão de Curso (TCC)**

**[Repositório](https://github.com/bitencourtjuh/tcc-julia-bitencourt)**

---

## Sobre o projeto

O **Cartório Digital** é um sistema web desenvolvido como Trabalho de Conclusão de Curso do **Técnico em Desenvolvimento de Sistemas**, voltado à digitalização, organização, gerenciamento e validação de documentos cartoriais.

A proposta é construir um protótipo com arquitetura semelhante à de um sistema real utilizado em cartórios, priorizando a organização dos documentos, a integridade das informações, a rastreabilidade e a segurança dos dados.

Cartórios lidam com documentos que precisam ser organizados, consultados, conferidos e armazenados com cuidado. Processos de digitalização podem envolver trabalho manual, dificuldade para localizar documentos, redigitação de informações e necessidade de verificar se um arquivo foi alterado. O projeto busca centralizar essas operações em uma plataforma digital.

> Este README descreve o que o projeto **pretende** fazer e o que **já está implementado** de fato. As duas coisas são sinalizadas separadamente ao longo do documento — nada aqui deve ser lido como "pronto para produção" até que a seção de Status confirme isso.

---

## Sumário

1. [Objetivo geral](#objetivo-geral)
2. [Objetivos específicos](#objetivos-específicos)
3. [Funcionamento esperado](#funcionamento-esperado)
4. [Arquitetura do sistema](#arquitetura-do-sistema)
5. [Stack tecnológica](#stack-tecnológica)
6. [Hash, metadados e blockchain](#hash-metadados-e-blockchain)
7. [Perfis de usuário e segurança](#perfis-de-usuário-e-segurança)
8. [Requisitos funcionais](#requisitos-funcionais)
9. [Requisitos não funcionais](#requisitos-não-funcionais)
10. [Status atual](#status-atual)
11. [Estrutura do repositório](#estrutura-do-repositório)
12. [Execução local](#execução-local)
13. [Limitações conhecidas](#limitações-conhecidas)
14. [Trabalhos futuros](#trabalhos-futuros)
15. [Documentação acadêmica](#documentação-acadêmica)
16. [Equipe](#equipe)
17. [Orientação](#orientação)

---

## Objetivo geral

Desenvolver um sistema web para digitalização e gerenciamento de documentos cartoriais, com interface intuitiva e arquitetura organizada, que permita o envio de arquivos, a extração e validação de dados, o armazenamento de metadados e a verificação da integridade dos documentos.

## Objetivos específicos

- Desenvolver uma interface web responsiva para os funcionários do cartório.
- Implementar autenticação e controle de acesso por perfil de usuário.
- Permitir o envio de documentos em formatos compatíveis.
- Pesquisar e integrar uma solução de OCR para extrair texto de documentos digitalizados.
- Investigar o uso de inteligência artificial para identificar e organizar campos como nome, CPF, datas e tipo de documento.
- Permitir a conferência e a correção dos dados extraídos antes da confirmação do registro.
- Armazenar os metadados dos documentos em um banco de dados relacional.
- Utilizar o algoritmo SHA-256 para gerar um hash que permita verificar se o conteúdo de um arquivo foi alterado.
- Investigar o uso de blockchain como uma possível camada adicional de registro de integridade.
- Implementar busca, filtros, consulta e histórico de documentos.
- Aplicar boas práticas de segurança, privacidade e proteção de dados.
- Documentar a arquitetura, os requisitos, os testes e as limitações do protótipo.

---

## Funcionamento esperado

```
1. Login
     │  o funcionário acessa a plataforma com suas credenciais
     ▼
2. Dashboard
     │  visão geral dos documentos e funcionalidades disponíveis
     ▼
3. Upload
     │  seleção de um arquivo para digitalização
     ▼
4. Processamento
     │  OCR (e, quando implementada, IA) reconhece o conteúdo e os campos
     ▼
5. Conferência
     │  o funcionário revisa os dados extraídos e corrige erros
     ▼
6. Validação
     │  os dados são confirmados antes do registro definitivo
     ▼
7. Integridade
     │  cálculo do hash SHA-256 do arquivo, associado ao registro
     ▼
8. Persistência
     │  metadados e informações gravados no banco de dados
     ▼
9. Consulta
     │  pesquisa por campos, visualização e verificação de integridade
     ▼
10. Histórico
     registro de operações relevantes (criação, validação, alterações)
```

Este é o fluxo **pretendido** pelo projeto. A seção [Status atual](#status-atual) indica quais destas etapas já existem no código e quais ainda são protótipo, simulação ou funcionalidade futura.

---

## Arquitetura do sistema

```
┌──────────────────────────────────────────────┐
│                   CLIENTE                     │
│              Navegador Web                    │
└───────────────────────┬────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────┐
│            FRONT-END (Aplicação)              │
│                                                │
│   React · TypeScript · Vite · React Router    │
│              Tailwind CSS                      │
│                                                │
│  Login | Dashboard | Upload | Validação       │
│              | Consulta                        │
└───────────────────────┬────────────────────────┘
                         │ API REST
                         ▼
┌──────────────────────────────────────────────┐
│              BACK-END (Java)                  │
│                                                │
│   Spring Boot · Spring Web · Spring Data JPA  │
│            Hibernate · Maven                   │
│                                                │
│  controller | service | repository | security│
│          domain/entity | dto | exception      │
└───────────────────────┬────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────┐
│                   MySQL                       │
│   usuários · metadados · validação · auditoria│
└──────────────────────────────────────────────┘

        (camadas investigadas / experimentais)
┌──────────────────────┐   ┌───────────────────────┐
│   OCR / IA            │   │  Hash SHA-256 +       │
│   extração de campos  │   │  Blockchain (opcional)│
└──────────────────────┘   └───────────────────────┘
```

A organização em camadas do back-end segue (respeitando os pacotes já existentes no repositório, sem duplicações):

- `config` — configurações da aplicação
- `controller` — endpoints da API
- `domain` / `entity` — entidades do sistema
- `dto` — objetos de comunicação entre camadas
- `repository` — acesso aos dados
- `service` — regras de negócio
- `security` — autenticação e autorização
- `exception` — tratamento de erros

---

## Stack tecnológica

| Camada        | Tecnologia                                   | Utilização                                      |
| ------------- | --------------------------------------------- | ------------------------------------------------ |
| Front-end     | React.js + TypeScript                         | Telas de login, dashboard, upload e consulta     |
| Build         | Vite                                           | Ambiente de desenvolvimento do front-end         |
| Roteamento    | React Router                                   | Navegação entre telas                            |
| Estilo        | Tailwind CSS                                   | Layout e responsividade                          |
| Back-end      | Java 17 + Spring Boot                          | Regras de negócio e API REST                     |
| Persistência  | Spring Data JPA + Hibernate                    | Mapeamento objeto-relacional                     |
| Build back-end| Maven                                          | Gerenciamento de dependências                    |
| Banco de dados| MySQL (via MySQL Connector/J)                 | Armazenamento de usuários, metadados e auditoria |
| OCR           | Em investigação (ex.: PaddleOCR-VL-1.6)       | Extração de texto dos documentos digitalizados   |
| Integridade   | SHA-256                                        | Hash para verificação de alteração do arquivo    |
| Registro      | Blockchain (experimental)                      | Possível camada adicional de integridade         |
| Versionamento | Git / GitHub                                   | Histórico e colaboração                          |

---

## Hash, metadados e blockchain

Esses três conceitos fazem parte do projeto, mas não são equivalentes:

- **Metadados** — informações estruturadas sobre o documento (identificador, tipo, data de registro, responsável, situação da validação).
- **Hash SHA-256** — resultado de uma função criptográfica aplicada ao conteúdo do arquivo. Se o conteúdo mudar, o hash recalculado será diferente; a verificação de integridade compara o hash atual com o valor de referência armazenado.
- **Blockchain** — estrutura de registro distribuído, tratada aqui como **possibilidade experimental** para registrar hashes e informações de integridade. Incluir um hash em uma blockchain não comprova, por si só, que o documento original é verdadeiro ou que os dados extraídos pelo OCR estão corretos.

A documentação do projeto deixa explícito qual dessas tecnologias está de fato implementada e qual permanece como proposta de evolução (ver [Status atual](#status-atual)).

---

## Perfis de usuário e segurança

| Perfil           | Atuação prevista                                             |
| ---------------- | -------------------------------------------------------------- |
| **Administrador**| Gerenciamento de usuários e configurações autorizadas          |
| **Tabelião**     | Validação e supervisão                                         |
| **Escrevente**   | Digitalização, conferência e consulta                          |

A autorização deve ser aplicada no back-end — esconder botões na interface não é suficiente.

Considerações de segurança previstas:

- Autenticação segura (JWT, caso seja a estratégia adotada)
- Senhas armazenadas com hash apropriado, nunca em texto puro
- Validação de arquivos e limites de tamanho
- Tratamento seguro de erros
- Controle de acesso por perfil
- Registro de operações relevantes
- Proteção de informações pessoais, incluindo CPF
- Criptografia em trânsito e proteção dos arquivos armazenados
- Princípios da LGPD e requisitos normativos aplicáveis ao contexto cartorial

A política de retenção e descarte dos documentos originais ainda precisa ser definida com cuidado, avaliando requisitos legais e operacionais.

---

## Requisitos funcionais

| ID    | Descrição                                                         |
| ----- | -------------------------------------------------------------------- |
| RF01  | Permitir autenticação de usuários                                    |
| RF02  | Controlar o acesso conforme o perfil autorizado                      |
| RF03  | Permitir o envio de documentos                                       |
| RF04  | Validar formato e tamanho dos arquivos                               |
| RF05  | Extrair texto e campos relevantes por OCR quando integrado           |
| RF06  | Permitir revisão e correção dos dados extraídos                      |
| RF07  | Registrar e consultar metadados                                      |
| RF08  | Gerar e armazenar o hash do arquivo                                  |
| RF09  | Verificar a integridade do documento                                 |
| RF10  | Pesquisar e filtrar documentos                                       |
| RF11  | Consultar o histórico de operações                                   |
| RF12  | Registrar a validação dos documentos                                 |
| RF13  | Apresentar mensagens de sucesso e erro de forma clara                |

A blockchain é tratada como requisito experimental ou funcionalidade futura, conforme o que estiver de fato implementado.

## Requisitos não funcionais

- Interface responsiva e intuitiva
- Código organizado e de fácil manutenção
- Separação adequada entre front-end, back-end e banco de dados
- Segurança das informações e controle de acesso
- Integridade dos arquivos e rastreabilidade das operações
- Tratamento consistente de erros
- Validação de entradas
- Documentação técnica
- Testes que permitam verificar o comportamento das funcionalidades
- Atenção à acessibilidade e à privacidade dos usuários

---

## Status atual

| Componente                                    | Situação                                   |
| ----------------------------------------------- | --------------------------------------------- |
| Interface web (React/TS/Vite) com telas de login, dashboard, upload, validação e consulta | Protótipo de front-end implementado |
| Autenticação e controle de acesso por perfil   | A verificar no código / planejado             |
| Upload de documentos                           | Simulado no front-end (mockado)               |
| Extração de dados por OCR                      | Integração real não confirmada                |
| Identificação de campos por IA                 | Simulado no front-end (mockado)               |
| Conferência e correção dos dados extraídos     | Protótipo de interface                        |
| Persistência em MySQL                          | Estrutura inicial de back-end em Java/Spring Boot; conexão completa a verificar |
| Hash SHA-256                                    | Tratado como simulação em partes do protótipo |
| Blockchain                                      | Experimental / não confirmado como implementação real |
| Busca, filtros e histórico                     | Planejado                                      |

> Nenhuma linha desta tabela deve ser lida como "pronto para uso profissional" sem antes confirmar, no código atual, se a funcionalidade está de fato conectada a uma API real ou se ainda é dado simulado no front-end.

---

## Estrutura do repositório

Estrutura atual:

```
tcc-julia-bitencourt/
├── .vscode
├── Aplicação
├── Artigos base
├── Documentação
├── Prototipo-Frontal-TCC
├── paddleocr-mini
└── README.md
```

Sugestão de organização (alinhada ao padrão adotado em outros TCCs da mesma turma/orientação, para facilitar a avaliação):

```
tcc-julia-bitencourt/
├── Cronogramas              ← novo: planejamento e cronograma das etapas
├── Diagramas                ← novo: casos de uso, classes, ER, arquitetura
├── Diário de bordo          ← novo: registro incremental do desenvolvimento
├── Documentação             ← já existe: manter
├── Pesquisas                ← pode absorver o conteúdo de "Artigos base"
├── Protótipos               ← pode absorver "Prototipo-Frontal-TCC"
├── Relatórios               ← novo: relatórios parciais/finais
├── Videos e apresentações   ← novo: materiais de apresentação
├── Aplicação                ← código-fonte real (front-end + back-end)
└── README.md
```

Essa reorganização é apenas uma sugestão de nomenclatura/pastas — nenhum conteúdo de código é alterado por ela, só a forma como o histórico do TCC fica documentado e navegável no GitHub.

---

## Execução local

```bash
git clone https://github.com/bitencourtjuh/tcc-julia-bitencourt.git
cd tcc-julia-bitencourt
```

Front-end:

```bash
cd Aplicação
npm install
npm run dev
```

Back-end (quando a estrutura Java estiver pronta para rodar):

```bash
cd <pasta-do-back-end>
mvn spring-boot:run
```

> Os comandos exatos de back-end dependem da estrutura final de pastas do projeto Java/Maven — ajuste conforme o `pom.xml` do repositório.

---

## Limitações conhecidas

- O projeto ainda está em desenvolvimento; partes do fluxo descrito são protótipo ou simulação, não implementação final.
- A integração real de OCR e IA precisa ser confirmada no código antes de ser apresentada como funcionalidade entregue.
- Hash e blockchain foram tratados, em algumas etapas, como simulação visual — a diferença entre uma implementação real e uma representação simulada deve ficar explícita na documentação acadêmica.
- A estratégia de armazenamento do conteúdo binário dos documentos originais ainda precisa ser definida.
- A política de retenção/descarte de documentos originais depende de requisitos legais que ainda não foram totalmente mapeados.

## Trabalhos futuros

- Confirmar e consolidar a integração real entre front-end e back-end.
- Implementar a extração de dados por OCR de forma efetiva (não simulada).
- Avaliar formalmente a viabilidade da camada de blockchain.
- Implementar autenticação e autorização completas, validadas no back-end.
- Expandir os testes (unitários, integração e de usabilidade).
- Consolidar a documentação acadêmica (ABNT) com base no que estiver realmente implementado.

---

## Documentação acadêmica

O trabalho acadêmico completo aborda introdução, problema de pesquisa, justificativa, objetivos, fundamentação teórica (digitalização, OCR, IA, hashes, blockchain, bancos de dados e segurança), trabalhos relacionados, metodologia, levantamento de requisitos, diagramas (casos de uso, arquitetura, atividades, classes), modelo entidade-relacionamento, implementação, testes e resultados, limitações, trabalhos futuros, conclusão e referências conforme as normas ABNT aplicáveis.

As telas, diagramas, endpoints e resultados descritos na documentação devem corresponder ao projeto real, sem resultados ou testes inventados.

---

## Equipe

| Integrante                              |
| ----------------------------------------- |
| **Julia Conceição Prazeres Bitencourt** |
| **Arthur Rilber**                       |
| **Yasmin Carvalho**                     |
| **Rafaela Sousa**                       |

## Orientação

- Prof. **Davi Villar**
- Prof. **Ricardo Palhares**

---

**Cartório Digital** · Trabalho de Conclusão de Curso · Técnico em Desenvolvimento de Sistemas
