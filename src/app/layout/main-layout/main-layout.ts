import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { MobileDock } from "../mobile-dock/mobile-dock";

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, RouterOutlet, MobileDock],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
