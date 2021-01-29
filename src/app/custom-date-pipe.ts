import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomDatePipe extends DatePipe {
transform(value,format): any {
    return super.transform(value,format);
}    

}
