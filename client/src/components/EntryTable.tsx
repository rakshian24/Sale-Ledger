import { useMemo } from "react";
import type { DailyEntry } from "../types/entry";
import { formatCurrency, formatDate } from "../utils/formatters";

type EntryTableProps = {
  entries: DailyEntry[];
  isOnline: boolean;
  onEdit: (entry: DailyEntry) => void;
  onDelete: (entry: DailyEntry) => void;
};

export default function EntryTable({
  entries,
  isOnline,
  onEdit,
  onDelete,
}: EntryTableProps) {
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.salesCount += entry.salesCount ?? 0;
        acc.cash += entry.cash ?? 0;
        acc.phonePe += entry.phonePe ?? 0;
        acc.total += entry.total ?? 0;
        acc.expense += entry.expense ?? 0;
        acc.profit += entry.profit ?? 0;

        return acc;
      },
      {
        salesCount: 0,
        cash: 0,
        phonePe: 0,
        total: 0,
        expense: 0,
        profit: 0,
      },
    );
  }, [entries]);

  return (
    <section className="card records-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Records</p>
          <h2>Daily Entries</h2>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="empty-state">No entries found for this month.</p>
      ) : (
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sales</th>
                <th>Cash</th>
                <th>PhonePe</th>
                <th>Total</th>
                <th>Expense</th>
                <th>Profit</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry._id}
                  className={entry.isHoliday ? "holiday-row" : ""}
                >
                  <td data-label="Date">
                    <div className="date-cell">
                      <strong>{formatDate(entry.date)}</strong>

                      {entry.isHoliday ? (
                        <span className="tag">Holiday</span>
                      ) : null}
                    </div>
                  </td>

                  <td data-label="Sales">{entry.salesCount ?? 0}</td>

                  <td data-label="Cash">{formatCurrency(entry.cash)}</td>

                  <td data-label="PhonePe">{formatCurrency(entry.phonePe)}</td>

                  <td data-label="Total">{formatCurrency(entry.total)}</td>

                  <td data-label="Expense">{formatCurrency(entry.expense)}</td>

                  <td
                    data-label="Profit"
                    className={entry.profit >= 0 ? "profit-text" : "loss-text"}
                  >
                    {formatCurrency(entry.profit)}
                  </td>

                  <td data-label="Note" className="note-cell">
                    {entry.note || "-"}
                  </td>

                  <td data-label="Actions">
                    <div className="table-actions">
                      <button
                        type="button"
                        disabled={!isOnline}
                        onClick={() => onEdit(entry)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={!isOnline}
                        className="danger-button"
                        onClick={() => onDelete(entry)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="total-row">
                <td data-label="Summary">
                  <strong>Totals</strong>
                </td>

                <td data-label="Total Sales">
                  <strong>{totals.salesCount}</strong>
                </td>

                <td data-label="Total Cash">
                  <strong>{formatCurrency(totals.cash)}</strong>
                </td>

                <td data-label="Total PhonePe">
                  <strong>{formatCurrency(totals.phonePe)}</strong>
                </td>

                <td data-label="Total Collection">
                  <strong>{formatCurrency(totals.total)}</strong>
                </td>

                <td data-label="Total Expense">
                  <strong>{formatCurrency(totals.expense)}</strong>
                </td>

                <td
                  data-label="Total Profit"
                  className={totals.profit >= 0 ? "profit-text" : "loss-text"}
                >
                  <strong>{formatCurrency(totals.profit)}</strong>
                </td>

                <td className="total-empty-cell" />

                <td className="total-empty-cell" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
