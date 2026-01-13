import { Component } from '@angular/core';
import { CreateTaskModal } from "./components/create-task-modal/create-task-modal";

@Component({
  selector: 'app-tasks',
  imports: [CreateTaskModal],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {

}
