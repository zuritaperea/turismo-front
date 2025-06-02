import React from 'react';

const Table = ({ responsive = true, children, className = '' }) => {
  let headers = [];

  // Encontrar thead y tbody en los children
  const thead = React.Children.toArray(children).find(child => child.type === 'thead');
  const tbody = React.Children.toArray(children).find(child => child.type === 'tbody');

  // Extraer los textos de los <th>
  if (thead) {
    const headerRow = React.Children.toArray(thead.props.children)[0]; // primer <tr>
    headers = React.Children.toArray(headerRow.props.children).map(th => {
      const text = typeof th.props.children === 'string'
        ? th.props.children
        : React.Children.toArray(th.props.children).join(' ');
      return text;
    });
  }

  const renderMobile = () => {
    if (!tbody) return null;

    const rows = React.Children.toArray(tbody.props.children);

    return (
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIndex) => {
          const cells = React.Children.toArray(row.props.children);
          return (
            <div
              key={rowIndex}
              className="border rounded p-4 shadow-sm bg-white"
            >
              {cells.map((cell, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span className="font-semibold text-gray-600">{headers[i]}</span>
                  <span className="text-right text-gray-900">{cell.props.children}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDesktop = () => (
    <div className="overflow-x-auto hidden md:block">
      <table className={`w-full text-left border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );

  return responsive ? (
    <>
      {renderMobile()}
      {renderDesktop()}
    </>
  ) : (
    renderDesktop()
  );
};

export default Table;
