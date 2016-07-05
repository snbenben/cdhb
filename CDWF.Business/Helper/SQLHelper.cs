using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Threading;
using System.Configuration;

namespace CDWF.Business.Helper
{
    /// <summary>
    /// 一些常用的SQL方法调用,数据库专用
    /// </summary>
    public class SqlHelper
    {
        #region 全局静态变量
        //Database connection strings
        public string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["CDConnection"].ConnectionString;

        // Hashtable to store cached parameters
        private Hashtable parmCache = Hashtable.Synchronized(new Hashtable());
        #endregion

        #region 执行SQL语句－经典方法
        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) against an existing database connection 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="conn">an existing database connection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(SqlConnection connection, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) using an existing SQL Transaction 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="trans">an existing sql transaction</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(SqlTransaction trans, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();
            PrepareCommand(cmd, trans.Connection, trans, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }

        /// <summary>
        /// Execute a SqlCommand that returns a resultset against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader r = ExecuteReader(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>A SqlDataReader containing the results</returns>
        public SqlDataReader ExecuteReader(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(connectionString);
            // we use a try/catch here because if the method throws an exception we want to 
            // close the connection throw code, because no datareader will exist, hence the 
            // commandBehaviour.CloseConnection will not work
            try
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns the first column of the first record against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  Object obj = ExecuteScalar(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>An object that should be converted to the expected type using Convert.To{Type}</returns>
        public object ExecuteScalar(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns the first column of the first record against an existing database connection 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  Object obj = ExecuteScalar(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="conn">an existing database connection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>An object that should be converted to the expected type using Convert.To{Type}</returns>
        public object ExecuteScalar(SqlConnection connection, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            object val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            return val;
        }
        #endregion

        #region 缓存 SqlParameter
        /// <summary>
        /// add parameter array to the cache
        /// </summary>
        /// <param name="cacheKey">Key to the parameter cache</param>
        /// <param name="cmdParms">an array of SqlParamters to be cached</param>
        public void CacheParameters(string cacheKey, params SqlParameter[] commandParameters)
        {
            parmCache[cacheKey] = commandParameters;
        }

        /// <summary>
        /// Retrieve cached parameters
        /// </summary>
        /// <param name="cacheKey">key used to lookup parameters</param>
        /// <returns>Cached SqlParamters array</returns>
        public SqlParameter[] GetCachedParameters(string cacheKey)
        {
            SqlParameter[] cachedParms = (SqlParameter[])parmCache[cacheKey];

            if (cachedParms == null)
                return null;

            SqlParameter[] clonedParms = new SqlParameter[cachedParms.Length];

            for (int i = 0, j = cachedParms.Length; i < j; i++)
                clonedParms[i] = (SqlParameter)((ICloneable)cachedParms[i]).Clone();

            return clonedParms;
        }
        #endregion

        #region 装备 SqlCommand
        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn, bool isNeedReturnValue)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }

            // 加入返回参数
            if (isNeedReturnValue)
            {
                cmd.Parameters.Add(
                    new SqlParameter("ReturnValue", SqlDbType.Int, 4,
                    ParameterDirection.ReturnValue, false, 0, 0,
                    string.Empty, DataRowVersion.Default, null));
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn, SqlDbType sqlDbType, int size)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }

            //// 加入返回参数
            //if (sqlDbType != null)
            //{
            cmd.Parameters.Add(
                new SqlParameter("ReturnValue", sqlDbType, size,
                ParameterDirection.ReturnValue, false, 0, 0,
                string.Empty, DataRowVersion.Default, null));
            //}
        }
        #endregion

        #region 返回各类查询结果数据集 DataSet、DataView、DataTable
        /// <summary>
        /// 返回DataSet数据集
        /// </summary>
        /// <param name="strSql">SQL语句</param>        
        /// <returns></returns>
        public DataSet GetDataSet(string strSql)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds;
            }
            #endregion
        }

        /// <summary>
        /// 返回DataSet数据集
        /// </summary>
        /// <param name="strSql">SQL语句</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        /// <returns></returns>
        public DataSet GetDataSet(string strSql, params SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds;
            }
            #endregion
        }

        /// <summary>
        /// 添加DataSet表
        /// </summary>
        /// <param name="ds">DataSet对象</param>
        /// <param name="strSql">Sql语句</param>
        /// <param name="strTableName">表名</param>
        public void FillDataSet(DataSet ds, string strSql, string strTableName)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                da.Fill(ds, strTableName);
            }
            #endregion
        }

        /// <summary>
        /// 添加DataSet表
        /// </summary>
        /// <param name="ds">DataSet对象</param>
        /// <param name="strSql">Sql语句</param>
        /// <param name="strTableName">表名</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        public void FillDataSet(DataSet ds, string strSql, string strTableName, SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds, strTableName);
            }
            #endregion
        }

        /// <summary>
        /// 返回DataView数据视图
        /// </summary>
        /// <param name="strSql">Sql语句</param>
        /// <returns></returns>
        public DataView GetDataView(string strSql)
        {
            #region
            return GetDataSet(strSql).Tables[0].DefaultView;
            #endregion
        }

        /// <summary>
        /// 返回DataView数据视图
        /// </summary>
        /// <param name="strSql">Sql语句</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        /// <returns></returns>
        public DataView GetDataView(string strSql, SqlParameter[] prams)
        {
            #region
            return GetDataSet(strSql, prams).Tables[0].DefaultView;
            #endregion
        }

        /// <summary>
        /// 获得DataTable对象
        /// </summary>
        /// <param name="strSql">SQL语句</param>
        /// <returns></returns>
        public DataTable GetDataTable(string strSql)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                DataTable dt = new DataTable();
                da.Fill(dt);
                return dt;
            }
            #endregion
        }

        /// <summary>
        /// 获得DataTable对象
        /// </summary>
        /// <param name="strSql">SQL语句</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        /// <returns></returns>
        public DataTable GetDataTable(string strSql, params SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                return dt;
            }
            #endregion
        }
        #endregion

        #region 执行SQL语句
        /// <summary>
        /// 执行Sql语句
        /// </summary>
        /// <param name="strSql"></param>
        public int ExecuteSql(string strSql)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, null);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行Sql语句
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="prams">所需参数－SqlParameter</param>
        public int ExecuteSql(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行Sql语句
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="isNeedSqlTrans">是否需要事务（注：插入、删除、更新操作是，最好启用事务即设为true）</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        public int ExecuteSql(string strSql, bool isNeedSqlTrans, params SqlParameter[] prams)
        {
            if (isNeedSqlTrans)
            {
                int val;
                SqlCommand cmd = new SqlCommand();
                SqlTransaction sqlTrans = null;
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    try
                    {
                        if (conn.State != ConnectionState.Open)
                        {
                            conn.Open();
                        }
                        sqlTrans = conn.BeginTransaction();
                        val = ExecuteNonQuery(sqlTrans, CommandType.Text, strSql, prams);
                        if (val >= 1)
                        {
                            sqlTrans.Commit();
                        }
                        return val;
                    }
                    catch
                    {
                        try
                        {
                            sqlTrans.Rollback();
                        }
                        catch
                        {
                            throw;
                        }
                        throw;
                    }
                }
            }
            else
            {
                return ExecuteSql(strSql, prams);
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns a resultset against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader r = ExecuteReader(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>A SqlDataReader containing the results</returns>
        public SqlDataReader ExecuteSqlReader(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            // we use a try/catch here because if the method throws an exception we want to 
            // close the connection throw code, because no datareader will exist, hence the 
            // commandBehaviour.CloseConnection will not work
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                SqlDataReader sdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return sdr;
            }
            catch
            {
                conn.Close();
                throw;
            }

        }

        /// <summary>
        /// 执行SQL语句，并返回第一行第一列结果
        /// </summary>
        /// <param name="strSql">SQL语句</param>
        /// <returns></returns>
        public object ExecuteSqlReturn(string strSql)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, null);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行SQL语句，并返回第一行第一列结果
        /// </summary>
        /// <param name="strSql">SQL语句</param>
        /// <param name="prams">所需参数－SqlParameter</param>
        /// <returns></returns>
        public object ExecuteSqlReturn(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }
        #endregion

        #region 执行存储过程
        /// <summary>
        /// 执行存储过程，无返回值
        /// </summary>
        /// <param name="procName">存储过程的名称</param>
        public void RunProc(string procName)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, false);
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
            }
        }

        /// <summary>
        /// 执行存储过程，无返回值
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="prams">存储过程所需参数</param>
        public void RunProc(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, false);
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
            }
        }

        /// <summary>
        /// 执行存储过程，可以选择阻值线程多少时间，出错的话重复执行多少次，以及默认返回的bool值，返回bool值
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="defaultTimeSpan">阻值线程多少时间</param>
        /// <param name="defaultCount">出错的话重复执行多少次</param>
        /// <param name="defaultBool">默认返回的bool值</param>
        /// <param name="prams">存储过程所需参数</param>
        public bool RunProc(string procName, TimeSpan defaultTimeSpan, int defaultCount, bool defaultBool, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            bool state = false;

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                try
                {
                    PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, false);
                    state = RunProc(cmd, defaultTimeSpan, defaultCount, defaultBool, false, 0);
                }
                catch
                {
                    state = defaultBool;
                }
                return state;
            }
        }

        /// <summary>
        /// 执行存储过程，可以选择阻值线程多少时间，出错的话重复执行多少次，以及默认返回的bool值，返回bool值
        /// </summary>
        /// <param name="cmd">SqlCommand</param>
        /// <param name="defaultTimeSpan">阻值线程多少时间</param>
        /// <param name="defaultCount">出错的话重复执行多少次</param>
        /// <param name="defaultBool">默认返回的bool值</param>
        /// <param name="isUseSleep">是否启用线程阻值</param>
        /// <param name="nowCount">已执行多少次</param>
        private bool RunProc(SqlCommand cmd, TimeSpan defaultTimeSpan, int defaultCount, bool defaultBool, bool isUseSleep, int nowCount)
        {
            try
            {
                if (isUseSleep)
                {
                    Thread.Sleep(defaultTimeSpan);
                }
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return true;
            }
            catch
            {
                if (nowCount < defaultCount)
                {
                    nowCount += 1;
                    return RunProc(cmd, defaultTimeSpan, defaultCount, defaultBool, true, nowCount);
                }
                else
                {
                    return defaultBool;
                }
            }
        }

        /// <summary>
        /// 执行存储过程,返回int型结果
        /// </summary>
        /// <param name="procName">存储过程的名称</param>
        /// <returns>返回存储过程返回值</returns>
        public int RunProcRetInt(string procName)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, true);
                cmd.ExecuteNonQuery();
                int val = (int)cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行存储过程,返回int型结果
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="prams">存储过程所需参数</param>
        /// <returns>返回存储过程返回值</returns>
        public int RunProcRetInt(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, true);
                cmd.ExecuteNonQuery();
                int val = (int)cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行存储过程,返回object对象
        /// </summary>
        /// <param name="procName">存储过程的名称</param>
        /// <param name="retSqlDbType">返回值类型</param>
        /// <param name="size">返回值长度</param>
        /// <returns>返回存储过程返回值</returns>
        public object RunProcRetObj(string procName, SqlDbType retSqlDbType, int size)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行存储过程,返回object对象
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="retSqlDbType">返回值类型</param>
        /// <param name="size">返回值长度</param>
        /// <param name="prams">存储过程所需参数</param>
        /// <returns>返回存储过程返回值</returns>
        public object RunProcRetObj(string procName, SqlDbType retSqlDbType, int size, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行存储过程,返回object对象
        /// </summary>
        /// <param name="procName">存储过程名称</param>
        /// <param name="parmName">要返回的参数名</param>
        /// <param name="retSqlDbType">返回值类型</param>
        /// <param name="size">返回值长度</param>
        /// <param name="prams">存储过程所需参数</param>
        /// <returns>返回存储过程返回值</returns>
        public Object RunProcRetObj(string procName, string parmName, SqlDbType retSqlDbType, int size, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters[parmName].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// 执行存储过程返回DataReader对象
        /// </summary>
        /// <param name="procName">Sql语句</param>
        /// <param name="prams">存储过程所需参数</param>
        /// <returns>DataReader</returns>
        public SqlDataReader RunProcRetDr(string procName)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.StoredProcedure, procName, null, true, false);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }

        /// <summary>
        /// 执行存储过程返回DataReader对象
        /// </summary>
        /// <param name="procName">Sql语句</param>
        /// <param name="prams">存储过程所需参数</param>
        /// <returns>DataReader</returns>
        public SqlDataReader RunProcRetDr(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.StoredProcedure, procName, prams, true, false);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }
        #endregion

        #region 生成存储过程参数－没有加Cache,但使用方便
        /// <summary>
        /// 传入输入参数
        /// </summary>
        /// <param name="ParamName">存储过程名称</param>
        /// <param name="DbType">参数类型</param></param>
        /// <param name="Size">参数大小</param>
        /// <param name="Value">参数值</param>
        /// <returns>新的 parameter 对象</returns>
        public SqlParameter MyMakeInParam(string ParamName, SqlDbType DbType, int Size, object Value)
        {
            #region
            return MyMakeParam(ParamName, DbType, Size, ParameterDirection.Input, Value);

            #endregion
        }

        /// <summary>
        /// 传入返回值参数
        /// </summary>
        /// <param name="ParamName">存储过程名称</param>
        /// <param name="DbType">参数类型</param>
        /// <param name="Size">参数大小</param>
        /// <returns>新的 parameter 对象</returns>
        public SqlParameter MyMakeOutParam(string ParamName, SqlDbType DbType, int Size)
        {
            #region
            return MyMakeParam(ParamName, DbType, Size, ParameterDirection.Output, null);
            #endregion
        }

        /// <summary>
        /// 生成存储过程参数
        /// </summary>
        /// <param name="ParamName">存储过程名称</param>
        /// <param name="DbType">参数类型</param>
        /// <param name="Size">参数大小</param>
        /// <param name="Direction">参数方向</param>
        /// <param name="Value">参数值</param>
        /// <returns>新的 parameter 对象</returns>
        public SqlParameter MyMakeParam(string ParamName, SqlDbType DbType, Int32 Size, ParameterDirection Direction, object Value)
        {
            #region
            SqlParameter param;

            if (Size > 0)
                param = new SqlParameter(ParamName, DbType, Size);
            else
                param = new SqlParameter(ParamName, DbType);

            param.Direction = Direction;
            if (!(Direction == ParameterDirection.Output && Value == null))
                param.Value = Value;

            return param;
            #endregion
        }
        #endregion

        #region 插入记录返回新纪录的ID(主键，自增，int)
        /// <summary>
        /// 插入记录返回新纪录的ID(主键，自增，int)
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="parms"></param>
        /// <returns></returns>
        public int InsertReturnID(string strSqlInsert, params SqlParameter[] parms)
        {
            int id = 0;
            DataTable dt = GetDataTable(strSqlInsert + " Select @@Identity ", parms);
            if (dt != null && dt.Rows.Count > 0)
            {
                id = int.Parse(dt.Rows[0][0].ToString());
            }
            return id;
        }
        #endregion
    }
}