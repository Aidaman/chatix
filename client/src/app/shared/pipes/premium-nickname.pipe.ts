import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "premiumNickname"
})
export class PremiumNicknamePipe implements PipeTransform {

  transform(value: string | undefined, isPremium: boolean): any {
    return isPremium? `👑${value}👑` : value;
  }

}
