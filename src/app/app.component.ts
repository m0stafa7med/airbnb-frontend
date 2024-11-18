import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Button} from "primeng/button";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fontAwesomeIcons} from "../shared/font-awesome-icons";
import {ToastModule} from "primeng/toast";
import {NavbarComponent} from "./layout/navbar/navbar.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {ToastService} from "./layout/navbar/toast.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button, FontAwesomeModule, ToastModule, NavbarComponent, FooterComponent],
  providers:[MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'airbnb-clone-front';
  faIconLibrary = inject(FaIconLibrary);
  isListingView = true;
  toastService = inject(ToastService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.initFontAwesome();
    this.listenToastService();
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToastService() {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if (newMessage && newMessage.summary !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    })
  }
}
