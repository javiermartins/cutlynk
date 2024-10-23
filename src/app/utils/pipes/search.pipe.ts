import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], filterBy: string): any[] {
    if (!items || !filterBy) {
      return items || [];
    }

    const trimmedFilter = filterBy.trim().toLowerCase();

    return items.filter(item => {
      const shortUrl = item?.shortUrl?.toLowerCase() || '';
      const originalUrl = item?.originalUrl?.toLowerCase() || '';

      return shortUrl.includes(trimmedFilter) || originalUrl.includes(trimmedFilter);
    });
  }

}
