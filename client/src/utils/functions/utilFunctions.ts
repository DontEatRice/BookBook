export function translateStatus(status: string) {
  switch (status) {
    case 'Pending':
      return 'W trakcie';
    case 'GivenOut':
      return 'Wydana';
    case 'Returned':
      return 'Zwrócona';
    case 'Cancelled':
      return 'Anulowana';
    case 'CancelledByAdmin':
      return 'Anulowana przez pracownika';
  }
  return 'Nieznany';
}

