
const addButton = document.getElementById('addButton');
const formContainer = document.getElementById('formContainer');
const applicationForm = document.getElementById('applicationForm');
const cancelButton = document.getElementById('cancelButton');

const applicationList = document.getElementById('applicationList');
const emptyMessage = document.getElementById('emptyMessage');

const totalCount = document.getElementById('totalCount');
const progressCount = document.getElementById('progressCount');
const interviewCount = document.getElementById('interviewCount');

let applications = [];
let nextId = 1;

// Abre o formulário de cadastro.
addButton.addEventListener('click', () => {
  formContainer.classList.remove('hidden');
  document.getElementById('company').focus();
});

// Cancela o cadastro.
cancelButton.addEventListener('click', () => {
  applicationForm.reset();
  formContainer.classList.add('hidden');
});

// Atualiza os números apresentados no painel.
function updateStats() {
  totalCount.textContent = applications.length;

  progressCount.textContent = applications.filter(application =>
    ['Candidatado', 'Em andamento'].includes(application.status)
  ).length;

  interviewCount.textContent = applications.filter(application =>
    application.status === 'Entrevista'
  ).length;
}

// Cria elementos de texto sem interpretar o conteúdo como HTML.
function createTextElement(tag, text, className = '') {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

// Exibe as candidaturas cadastradas.
function renderApplications() {
  applicationList.replaceChildren();

  emptyMessage.classList.toggle(
    'hidden',
    applications.length > 0
  );

  applications.forEach(application => {
    const card = document.createElement('article');
    card.className = 'application-item';

    const title = createTextElement(
      'h4',
      application.position
    );

    const company = createTextElement(
      'p',
      'Empresa: ' + application.company
    );

    const type = createTextElement(
      'p',
      'Tipo: ' + application.type
    );

    const status = createTextElement(
      'span',
      application.status,
      'status'
    );

    const statusParagraph = document.createElement('p');
    statusParagraph.appendChild(status);

    card.append(title, company, type, statusParagraph);

    // Exibe o link da vaga, caso tenha sido informado.
    if (application.link) {
      const link = document.createElement('a');

      link.className = 'application-link';
      link.href = application.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Ver vaga';

      card.appendChild(link);
    }

    // Botão para excluir uma candidatura.
    const deleteButton = createTextElement(
      'button',
      'Excluir candidatura',
      'delete-button'
    );

    deleteButton.type = 'button';

    deleteButton.addEventListener('click', () => {
      const confirmed = confirm(
        'Deseja realmente excluir esta candidatura?'
      );

      if (!confirmed) {
        return;
      }

      applications = applications.filter(
        item => item.id !== application.id
      );

      renderApplications();
    });

    card.appendChild(deleteButton);
    applicationList.appendChild(card);
  });

  updateStats();
}

// Recebe e valida os dados do formulário.
applicationForm.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(applicationForm);

  const company = formData.get('company').trim();
  const position = formData.get('position').trim();
  const type = formData.get('type');
  const status = formData.get('status');
  const link = formData.get('link').trim();

  if (!company || !position || !type || !status) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  // Verifica se o link informado é válido.
  if (link) {
    try {
      const parsedUrl = new URL(link);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Protocolo inválido');
      }
    } catch {
      alert(
        'Informe um link válido começando com http:// ou https://.'
      );
      return;
    }
  }

  // Cria a candidatura.
  const application = {
    id: nextId++,
    company,
    position,
    type,
    status,
    link
  };

  applications.push(application);

  applicationForm.reset();
  formContainer.classList.add('hidden');

  renderApplications();

  alert('Candidatura adicionada à lista!');
});

// Inicializa a página.
renderApplications();
