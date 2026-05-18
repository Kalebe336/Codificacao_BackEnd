let editingId = null;
let notes = [];

function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function render() {
    const previewList = document.getElementById('previewList');
    if (!previewList) return;

    previewList.innerHTML = '';

    for (const note of notes) {
        const card = document.createElement('div');
        card.className = 'preview-card';

        if (note.studentName) {
            const divName = document.createElement('div');
            divName.className = 'viewName';
            divName.innerText = 'Nome do aluno: ' + note.studentName;
            card.appendChild(divName);
        }

        if (note.studentClass) {
            const divClass = document.createElement('div');
            divClass.className = 'viewClass';
            divClass.innerText = 'Turma: ' + note.studentClass;
            card.appendChild(divClass);
        }

        if (note.studentGrade) {
            const divGrade = document.createElement('div');
            divGrade.className = 'viewGrade';
            divGrade.innerText = 'Nota: ' + note.studentGrade;
            card.appendChild(divGrade);
        }

        if (note.studentNotes) {
            const divNotes = document.createElement('div');
            divNotes.className = 'viewNotes';

            // Respeita as quebras de linha digitadas no textarea (Enter vira nova linha no preview)
            const safeNotes = String(note.studentNotes)
                .replace(/&/g, '&amp;')
                .replace(/</g, '<')
                .replace(/>/g, '>')
                .replace(/"/g, '"')
                .replace(/'/g, '&#039;');

            divNotes.innerHTML = 'Observações: ' + safeNotes.replace(/\n/g, '<br>');
            card.appendChild(divNotes);
        }

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = 'btn-card btn-delete';
        btnDelete.innerText = 'Excluir';
        btnDelete.addEventListener('click', () => excluirNota(note.id));

        const btnEdit = document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.className = 'btn-card btn-edit';
        btnEdit.innerText = 'Editar';
        btnEdit.addEventListener('click', () => iniciarEdicao(note));

        actions.appendChild(btnDelete);
        actions.appendChild(btnEdit);
        card.appendChild(actions);

        previewList.appendChild(card);
    }
}

function iniciarEdicao(note) {
    editingId = note.id;

    document.getElementById('studentName').value = note.studentName ?? '';
    document.getElementById('studentClass').value = note.studentClass ?? '';
    document.getElementById('studentGrade').value = note.studentGrade ?? '';
    document.getElementById('studentNotes').value = note.studentNotes ?? '';

    const btn = document.querySelector('.btn-save');
    if (btn) btn.innerText = 'Atualizar nota';
}

function salvarNota() {
    const name = document.getElementById('studentName').value.trim();
    const className = document.getElementById('studentClass').value.trim();
    const grade = document.getElementById('studentGrade').value.trim();
    const notesText = document.getElementById('studentNotes').value.trim();

    if (!name && !className && !grade && !notesText) {
        alert('Preencha pelo menos um campo para salvar.');
        return;
    }

    if (editingId) {
        const idx = notes.findIndex((n) => n.id === editingId);
        if (idx !== -1) {
            notes[idx] = {
                ...notes[idx],
                studentName: name,
                studentClass: className,
                studentGrade: grade,
                studentNotes: notesText,
            };
        }
    } else {
        const note = {
            id: uid(),
            studentName: name,
            studentClass: className,
            studentGrade: grade,
            studentNotes: notesText,
        };
        notes.unshift(note);
    }

    editingId = null;

    const btn = document.querySelector('.btn-save');
    if (btn) btn.innerText = 'Salvar nota';

    document.getElementById('notesForm').reset();
    alert(editingId ? 'Nota atualizada com sucesso!' : 'Nota salva com sucesso!');

    render();
}

function excluirNota(id) {
    const ok = confirm('Excluir esta nota?');
    if (!ok) return;

    notes = notes.filter((n) => n.id !== id);

    if (editingId === id) {
        editingId = null;
        const btn = document.querySelector('.btn-save');
        if (btn) btn.innerText = 'Salvar nota';
        document.getElementById('notesForm').reset();
    }

    alert('Nota excluída!');
    render();
}

autoInit();

function autoInit() {
    render();
}


