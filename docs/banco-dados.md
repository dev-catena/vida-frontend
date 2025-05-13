# Comparação de Estruturas do Banco de Dados

## Projeto Antigo (Laravel)

### Entidades Principais

1. **Hóspedes (hospedes)**
   - Campos básicos: id, nome, cpf, data_nascimento, telefone, email
   - Campos clínicos: alergias, medicamentos, condições_especiais
   - Campos sociais: profissao, estado_civil, religiao
   - Relacionamentos: leito_id, responsaveis, movimentacoes

2. **Quartos e Leitos**
   - Quartos: numero, tipo, capacidade, status
   - Leitos: numero, quarto_id, status
   - Relacionamento: quarto -> leitos (1:N)

3. **Movimentações**
   - Campos: tipo (entrada/saída), data, motivo, responsavel
   - Relacionamentos: hospede_id, user_id

4. **Saúde**
   - Evoluções: data, descricao, user_id
   - Sinais Vitais: pressao, temperatura, glicemia, etc.
   - Prescrições: medicamentos, dosagem, horarios
   - Exames: tipo, data, resultado

5. **Segurança**
   - Usuários: autenticação e autorização
   - Permissões: roles e permissions
   - Tokens: personal_access_tokens

## Projeto Novo (Node.js)

### Entidades Principais

1. **Hóspedes**
   - Campos básicos: id, nome, cpf, data_nascimento, telefone, email
   - Campos adicionais: 
     - Dados institucionais (unidade, modalidade)
     - Dados de saúde (quadro_clinico, expectativas_familia)
     - Condições especiais (uso_oxigenio, restricoes_alimentares)
   - Relacionamentos: responsaveis, prontuario, movimentacoes

2. **Hospedagem**
   - Campos: numero, hospede_id, quarto_id, data_entrada, data_saida, valor_total, status
   - Relacionamentos: hospede, quarto, pagamentos

3. **Quartos**
   - Campos: numero, tipo, capacidade, status, valor_diaria
   - Relacionamentos: hospedagens

4. **Pagamentos**
   - Campos: valor, forma_pagamento, numero_comprovante, observacoes
   - Relacionamentos: hospedagem_id

5. **Responsáveis**
   - Campos: 
     - Dados pessoais: nome, cpf, rg, data_nascimento, telefone, email
     - Dados de contato: endereco, cidade, estado, cep
     - Dados de relacionamento: grau_parentesco, responsavel_legal
     - Dados de emergência: contato_emergencia, telefone_emergencia
   - Relacionamentos: hospede_id

6. **Prontuário Eletrônico**
   - Campos gerais:
     - Quadro clínico inicial
     - Histórico familiar
     - Alergias conhecidas
     - Medicamentos em uso
     - Condições crônicas
   
   - Evoluções:
     - Data e hora
     - Profissional responsável
     - Descrição detalhada
     - Plano de cuidados
     - Intercorrências
   
   - Sinais Vitais:
     - Pressão arterial
     - Temperatura
     - Frequência cardíaca
     - Frequência respiratória
     - Glicemia
     - Saturação de O2
     - Data e hora da aferição
   
   - Prescrições:
     - Medicamentos
     - Dosagem
     - Frequência
     - Via de administração
     - Data de início
     - Data de término
     - Observações
   
   - Exames:
     - Tipo de exame
     - Data da solicitação
     - Data da realização
     - Local de realização
     - Resultado
     - Anexos (imagens, laudos)
   
   - Intervenções:
     - Tipo de intervenção
     - Data e hora
     - Profissional responsável
     - Descrição
     - Resultado
   
   - Relacionamentos: hospede_id, profissional_id

## Melhorias Implementadas

1. **Normalização**
   - Separação clara entre dados de hóspede e dados de hospedagem
   - Melhor organização dos campos relacionados à saúde
   - Estrutura mais flexível para pagamentos
   - Sistema de responsáveis mais completo
   - Prontuário eletrônico estruturado

2. **Campos Novos**
   - Dados institucionais mais detalhados
   - Melhor controle de condições especiais
   - Sistema de pagamentos mais robusto
   - Dados de emergência para responsáveis
   - Histórico completo de saúde

3. **Relacionamentos**
   - Melhor definição das relações entre entidades
   - Adição de campos de auditoria (created_at, updated_at)
   - Suporte a soft deletes
   - Rastreamento de alterações no prontuário

## Próximos Passos

1. [ ] Revisar campos obrigatórios
2. [ ] Implementar validações
3. [ ] Criar índices para otimização
4. [ ] Documentar APIs
5. [ ] Implementar migrações
6. [ ] Criar rotinas de backup do prontuário
7. [ ] Implementar sistema de logs de acesso
8. [ ] Desenvolver relatórios de saúde 