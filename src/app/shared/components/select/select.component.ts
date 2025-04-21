import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnChanges {
  @Input() items: any[] = [];
  @Input() groupBy?: string;
  @Input() bindLabel: string = 'name';
  @Input() bindValue: string = 'id';
  @Input() placeholder: string = 'Selecciona una opción';

  @Output() selectedChange = new EventEmitter<any>();

  isDropdownOpen = false;
  selectedItem: any = null;
  groupedItems: any[] = [];
  private _selectedValue: any = null;

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['groupBy']) {
      this.prepareGroupedItems();
      this.updateSelectedItem();
    }
  }

  get selectedValue(): any {
    return this._selectedValue;
  }

  @Input()
  set selectedValue(val: any) {
    this._selectedValue = val;
    this.updateSelectedItem();
    this.onChange(val);
    this.onTouched();
  }

  private prepareGroupedItems(): void {
    if (!this.groupBy || !this.items || this.items.length === 0) {
      this.groupedItems = [];
      return;
    }

    const groupsMap = new Map<string, any[]>();

    // Group items by the groupBy property
    this.items.forEach(item => {
      const groupKey = item[this.groupBy!];
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }
      groupsMap.get(groupKey)!.push(item);
    });

    // Convert the map to an array of groups
    this.groupedItems = Array.from(groupsMap.entries()).map(([groupName, items]) => ({
      groupName,
      items,
    }));
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.onTouched();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectItem(item: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedItem = item;
    this.selectedValue = item[this.bindValue];
    this.selectedChange.emit(this.selectedValue);
    this.closeDropdown();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedItem = null;
    this.selectedValue = null;
    this.selectedChange.emit(null);
  }

  private updateSelectedItem(): void {
    if (!this._selectedValue || !this.items || this.items.length === 0) {
      this.selectedItem = null;
      return;
    }

    if (this.groupBy) {
      // Buscar en items agrupados
      for (const group of this.groupedItems) {
        const found = group.items.find((item: any) => item[this.bindValue] === this._selectedValue);
        if (found) {
          this.selectedItem = found;
          return;
        }
      }
    } else {
      // Buscar en items planos
      const found = this.items.find(item => item[this.bindValue] === this._selectedValue);
      this.selectedItem = found || null;
    }
  }

  getDisplayLabel(item: any): string {
    return item ? item[this.bindLabel] : '';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isDropdownOpen) return;

    const target = event.target as HTMLElement;
    if (!target.closest('.selector-container')) {
      this.closeDropdown();
    }
  }
}
