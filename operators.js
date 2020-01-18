// This is what was asked to be implemented
module.exports.sortByGrade = (students) =>
{
    // @param: Array of students to sort
    // @return: Array of array of students sorted by grade
    // @return: grades
    let sorted_students = [];
    let grades = [];
    // NOTE: GRADES AND SORTED STUDENTS CORERSPOND BY ITERATOR

    for(let i = 0; i < students.length; i++)
    {
        let grade = students[i].grade;
        let grade_index = grades.indexOf(grade);
        if ( grade_index == -1 )
        {
            // If we do not find the grade
            grades.push( grade );
            sorted_students.push( [ students[i] ] );
        }
        else
        {
            // We found the grade index! So we found the array for sorted student
            sorted_students[grade_index].push(students[i]);
        }
    }

    return [sorted_students, grades];

}

// This is what was asked to be implemented
module.exports.findLowestAverageGrades = (students) =>
{
    console.log('Starting to look for lowest averages per grade group.');
    const [sorted_students, grades] = this.sortByGrade(students);
    console.log(sorted_students);
    console.log(grades);

    students = [];
    lowest_avgs = [];

    sorted_students.forEach((group)=>{
        const [student, min_avg] = this.findLowestAverageStudent(group);

        students.push(student);
        lowest_avgs.push(min_avg);
    });
    return [students, lowest_avgs];
}

module.exports.findLowestAverageStudent = (students) =>
{
    // @param: Array of students to find lowest
    // @return: Array of array of students sorted by grade
    // @return: grades
    console.log("Starting to look for lowest average student!")
    console.log(students);
    let min_avg = 9999999;
    let min_indx = -1;

    let avg = 0;
    let sum = 0; // In case we have more than just 4 subjects
    for(let i = 0; i < students.length; i++)
    {
        console.log("student grades");
        console.log(students[i].scores);
        students[i].scores.forEach(elem => {
            avg += elem.value;
            sum += 1;
        })
        avg /= sum;

        if ( avg < min_avg )
        {
            min_indx = i;
            min_avg = avg;
        }
        avg = 0;
        sum = 0;
    }

    return [students[min_indx], min_avg];
}
