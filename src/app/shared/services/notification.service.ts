import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: ToastrService) {}

  public showSuccess(title: string, message: string): void {
    this.toastrService.success(message, title, {closeButton: true});
  }

  public showInfo(title: string, message: string): void {
    this.toastrService.info(message, title, {closeButton: true});
  }

  public showError(title: string, message: string): void {
    this.toastrService.error(message, title, {closeButton: true});
  }

  public showWarning(title: string, message: string): void {
    this.toastrService.warning(message, title, {closeButton: true});
  }
}
