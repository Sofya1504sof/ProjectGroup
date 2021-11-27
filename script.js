const tableBody = document.getElementById('table-body'); // Тело таблицы, в которой будут находится записи с каждым студентом
const categoriesButton = document.querySelector('input[type="button"]'); // Кнопка, при нажатии на которую будут распределяться категории и строиться график

function generateRows(num) { // Для удобства и компактности кода создал функции, которая автоматически создает нужное количество записей с пустыми полями для ввода фамилии и оценок
    for (let i = 0; i < num; i++) {
        const rowHTML = `
        <tr class="row">
            <td>
                <input type="text" name="lastname" id="lastname" placeholder="Введите фамилию">
            </td>
            <td class="grades">
                <input class="grade" type="text" name="grade1" id="" placeholder="№1">
                ,
                <input class="grade" type="text" name="grade2" id="" placeholder="№2">
            </td>
            <td class="category">
                <input type="text" name="category" disabled>
            </td>
        </tr>
        `;
        
        tableBody.innerHTML += rowHTML;
    }
}

function studentsStats() { // Функционал распределения по категориям и построения графика собран в данной функции 
    let students = []; // Массив со всеми студентами
    let excellent = []; // Студенты отличнки 
    let wellPerforming = []; // Хорошо успевающие студенты
    let achievers = []; // Успевающие студенты
    let underperforming = []; // Неуспевающие студенты

    const rows = Array.from(tableBody.rows); // Из тела таблицы берем все записи
    rows.map((row) => { // С помощью метода map итерируемся по каждой записи и берем из нее значения из полей с фамилией и оценками
        const lastname = row.querySelector('input[name="lastname"]'); // Фамилия
        const grade1 = row.querySelector('input[name="grade1"]'); // Оценка 1
        const grade2 = row.querySelector('input[name="grade2"]'); // Оценка 2
    
        students.push({ // Методом push заносим в массив со всеми студентами объект с фамилией и массивом оценок 
            lastname: lastname.value,
            grades: [+grade1.value, +grade2.value]
        });

    })

    function setCategory(array, row, category) { // Дополнительная функция для создания массива из записей для каждой категории 
        array.push(row); // В массив каждой категории будут заноситься записи соответствующей категории
        row.querySelector('input[name="category"]').value = category; // Из каждой записи береться инпут для категории и указывается сама категория
    }

    function setStudentsCategories() { // Функция для определения категории на основе оценок студента
        students.map((student, i) => {
            const grades = student.grades; // Массив с оценками
            if (grades.every(grade => grade === 5)) { // Если каждая оценка студента равна 5
                setCategory(excellent, rows[i], 'Отличники'); // В массив с отличниками заносяться записи, соответствующие этим студентам и выводиться название соответствующей категории
            }
            
            if (grades.includes(4) && !grades.includes(3) && !grades.includes(2)) { // Если у студента присутствует 4 и нет 3 и 2
                setCategory(wellPerforming, rows[i], 'Хорошо успевающие'); // В массив с хорошо успевающими заносяться записи, соответствующие этим студентам и выводиться название соответствующей категории 
            }
            
            if (grades.includes(3)) { // Если у студента есть хотя бы одна 3
                setCategory(achievers, rows[i], 'Успевающие'); // В массив с успевающими заносяться записи, соответствующие этим студентам и выводиться название соответствующей категории
            }
            
            if (grades.includes(2)) { // Если у студента есть хотя бы одна 2
                setCategory(underperforming, rows[i], 'Неуспевающие');// В массив с хорошо неуспевающими заносяться записи, соответствующие этим студентам и выводиться название соответствующей категории
            }
            
        })

    }
    setStudentsCategories();

    function setDiagram() { // Функция для построения графика
        const studentsCount = students.length; // Число всех студентов
        const allCategories = [excellent, wellPerforming, achievers, underperforming]; // Массив со всеми записями для каждой категории

        const images = Array.from(document.images); // Массив м картинками

        images.map((image, i) => { // Для краткости кода, с помощью метода map итерируемся по всем картинкам 
            image.height = Math.round(allCategories[i].length * studentsCount); // Каждой картинке устанавливаем высоту, которая будет зависеть от длины массива каждой категории, умноженой на общее количество студентов 
        })
    }
    setDiagram();

}

window.addEventListener('load', () => { // При загрузке страницы
    document.body.style.visibility = 'visible'; // Свойство visibility у body устанавливаем на visible, чтобы предотвратить мерцания не прогрузившихся стилей страницы
    generateRows(10); // Создается 10 записей в таблице
})

categoriesButton.addEventListener('click', studentsStats); // Функция с основным функционалом будет срабатывать при клике