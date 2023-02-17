import React from 'react';

type TabsProps = { children: any };

function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(children[0]);

  children.forEach(({ type }: { type: any }) => {
    if (type.name !== 'Tab')
      throw new Error('Only <Tab> component can be direct children of <Tabs>');
  });

  return (
    <div className="grid grid-rows-[auto_auto] gap-2 m-2 justify-items-start bg-slate-100 dark:bg-slate-900 text-sm ">
      <ul className="flex justify-center items-center gap-2 bg-slate-800 p-1 text-white rounded-md cursor-pointer">
        {children.map((child: any) => (
          <li
            key={child?.props?.title}
            onClick={() => setActiveTab(child)}
            className={`px-4 py-1 font-semibold rounded-md capitalize ${
              child.props.title === activeTab?.props?.title && 'bg-slate-900'
            }`}
          >
            {child?.props?.title}
          </li>
        ))}
      </ul>
      <div className="block border border-slate-700 rounded-md p-4 min-w-full">
        {children.filter((child: any) => child === activeTab)[0]}
      </div>
    </div>
  );
}

export default Tabs;
