import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {iconBroadActivityFeed} from "@app/ui/icons/broad-activity-feed/icon";
import {iconChevronLeft} from "@app/ui/icons/chevron/chevron-left/icon";
import {iconChevronRight} from "@app/ui/icons/chevron/chevron-right/icon";
import {iconEditOutline} from "@app/ui/icons/edit/icon";
import {iconDeleteOutline32} from "@app/ui/icons/delete/icon";
import {iconWebAssetOutline} from "@app/ui/icons/web-asset/icon";
import {iconArrowLeft20} from "@app/ui/icons/arrow/arrow-left/icon";
import {iconExit20Outline} from "@app/ui/icons/exit/icon";
import {IconDesktopOutline} from "@app/ui/icons/desktop/icon";
import {IconChevronTopOutline32} from "@app/ui/icons/chevron/chevron-top/icon";
import {IconChevronBottomOutline32} from "@app/ui/icons/chevron/chevron-bottom/icon";
import {IconSlideTransition32} from "@app/ui/icons/slide-transition/icon";
import {IconTextListOutline32} from "@app/ui/icons/text-list/icon";
import {IconEmptyFolderOutlineBig} from "@app/ui/icons/empty-folder/icon";
import {iconLock32Outline} from "@app/ui/icons/lock/icon";
import {iconKey32Outline} from "@app/ui/icons/key/icon";
import {iconAlertOn32Outline} from "@app/ui/icons/alert-on/icon";
import {
  iconChevronVectorRightOutline32
} from "@app/ui/icons/chevron-vector/chevron-vector-right/icon";
import {iconChevronVectorLeftOutline32} from "@app/ui/icons/chevron-vector/chevron-vector-left/icon";
import {SettingIconOutlineBase} from "@app/ui/icons/setting/icon";
import {eyeIconHide} from "@app/ui/icons/eye/hide/hide";
import {eyeIconShow} from "@app/ui/icons/eye/show/show";



@Directive({
  selector: '[appIcon]'
})
export class IconDirective implements OnInit {

  @Input() iconName: string;
  @Input() iconColor: string;

  constructor(private elementRef: ElementRef) {
    this.iconName='';
    this.iconColor= '';
  }

  ngOnInit(): void {
    const icon = this.iconName.split(' ');
    this.elementRef.nativeElement.innerHTML = this.findIcon(icon[0], icon[1]);
  }

  // TODO REFACTOR METHOD FIND ICON

  private findIcon(iconName: string, iconPosition: string): string {
    if (iconName === 'broad-activity-feed') {
      return this.findIconBroadActivityFeed(iconPosition, this.iconColor);
    } else if (iconName === 'chevron') {
      return this.findIconChevron(iconPosition, this.iconColor);
    } else if (iconName === 'edit') {
      return this.findIconEdit(this.iconColor);
    } else if (iconName === 'delete') {
      return this.findIconDelete(iconPosition, this.iconColor);
    } else if (iconName === 'web-asset') {
      return this.findIconWebAssetOutline(iconPosition, this.iconColor);
    } else if (iconName === 'arrow') {
      return this.findIconArrowOutline(iconPosition, this.iconColor);
    } else if (iconName === 'exit') {
      return this.findIconExitOutline(iconPosition, this.iconColor);
    } else if (iconName === 'desktop') {
      return this.findIconDesktopOutline(iconPosition, this.iconColor);
    } else if (iconName === 'slide-transition') {
      return this.findIconSlideTransition(iconPosition, this.iconColor);
    } else if (iconName === 'text-list') {
      return this.findIconTextListOutline(iconPosition, this.iconColor);
    } else if (iconName === 'empty-folder') {
      return this.findIconFolderEmpty(iconPosition, this.iconColor);
    } else if (iconName === 'lock') {
      return this.findIconLockOutline(iconPosition, this.iconColor);
    } else if (iconName === 'key') {
      return this.findIconKeyOutline(iconPosition, this.iconColor);
    } else if (iconName === 'alert-on') {
      return this.findIconAlertOnOutline(iconPosition, this.iconColor)
    } else if (iconName === 'chevron-vector') {
      return this.findIconChevronVectorOutline(iconPosition, this.iconColor);
    } else if (iconName === 'setting') {
      return this.findIconSetting(iconPosition, this.iconColor);
    } else if (iconName === 'eye') {
      return this.getIconEye(this.iconColor, iconPosition);
    }
      return '';
  }

  // TODO change path method find on
  public findIconBroadActivityFeed(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'table') {
      return iconBroadActivityFeed.replace('$2', iconColor);
    }
    return '';
  }

  public findIconChevron(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'left') {
      return iconChevronLeft.replace('$2', iconColor);
    } else if (iconPosition === 'right') {
      return iconChevronRight.replace('$2', iconColor);
    } else if (iconPosition === 'top') {
      return IconChevronTopOutline32.replace('$2', iconColor);
    } else if (iconPosition === 'bottom') {
      return IconChevronBottomOutline32.replace('$2', iconColor);
    }
    return '';
  }

  public findIconEdit(iconColor: string): string {
    return iconEditOutline.replace('$2', iconColor);
  }

  public findIconDelete(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return iconDeleteOutline32.replace('$2', iconColor);
    }
    return '';
  }

  public findIconWebAssetOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return iconWebAssetOutline.replace('$2', iconColor);
    }
    return '';
  }

  public findIconArrowOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'left-20') {
      return iconArrowLeft20.replace('$2', iconColor);
    }
    return '';
  }

  public findIconExitOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '20') {
      return iconExit20Outline.replace('$2', iconColor);
    }
    return '';
  }

  public findIconDesktopOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return IconDesktopOutline.replace('$2', iconColor);
    }
    return '';
  }

  public findIconSlideTransition(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return IconSlideTransition32.replace('$2', iconColor);
    }
    return '';
  }

  public findIconTextListOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return IconTextListOutline32.replace('$2', iconColor);
    }
     return '';
  }

  public findIconFolderEmpty(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'big') {
      return IconEmptyFolderOutlineBig.replace('$2', iconColor);
    }
    return '';
  }

  public findIconLockOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return iconLock32Outline.replace('$2', iconColor);
    }
    return '';
  }

  public findIconKeyOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return iconKey32Outline.replace('$2', iconColor);
    }
    return '';
  }

  public findIconAlertOnOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return iconAlertOn32Outline.replace('$2', iconColor)
    }
    return '';
  }

  public findIconChevronVectorOutline(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'right') {
      return iconChevronVectorRightOutline32.replace('$2', iconColor);
    } else if (iconPosition === 'left') {
      return  iconChevronVectorLeftOutline32.replace('$2', iconColor);
    }
    return '';
  }

  public findIconSetting(iconPosition: string, iconColor: string): string {
    if (iconPosition === '32') {
      return SettingIconOutlineBase.replace('$2', iconColor);
    }
    return '';
  }

  public getIconEye = (iconColor: string, iconPosition: string) => {
    if (iconPosition === 'hide') {
      return eyeIconHide.replace('$2', iconColor);
    } else if (iconPosition === 'show') {
      return eyeIconShow.replace('$2', iconColor);
    } else {
      return '';
    }
  };

}
