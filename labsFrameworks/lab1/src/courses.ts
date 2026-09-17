interface Course {
  name: string;
  durationHours: number;
  students: string[];
}

class OnlineCourse implements Course {
  constructor(
    public name: string,
    public durationHours: number,
    public students: string[] = []
  ) {}

  registerStudent(student: string): void {
    if (!this.isStudentRegistered(student)) {
      this.students.push(student);
    }
  }

  isStudentRegistered(student: string): boolean {
    return this.students.includes(student);
  }
}

class CourseManager {
  private courses: Course[] = [];

  addCourse(course: Course): void {
    this.courses.push(course);
  }
  removeCourse(courseName: string): void {
    this.courses = this.courses.filter((c) => c.name !== courseName);
  }
  findCourse(courseName: string): Course | undefined {
    return this.courses.find((c) => c.name === courseName);
  }

  printAllCourses(): void {
    this.courses.forEach((c) => {
      console.log(`Course: ${c.name}, Students: ${c.students.join(", ")}`);
    });
  }
}

const manager = new CourseManager();
const tsCourse = new OnlineCourse("TypeScript Basics", 20);
const reactCourse = new OnlineCourse("Advanced React", 40);

manager.addCourse(tsCourse);
manager.addCourse(reactCourse);

tsCourse.registerStudent("John Doe");
tsCourse.registerStudent("Jane Smith");
reactCourse.registerStudent("John Doe");

manager.printAllCourses();
